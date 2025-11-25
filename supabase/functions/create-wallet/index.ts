import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { Wallet } from 'npm:ethers@6.13.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    console.log('Creating wallet for user:', user.id)

    // Check if user already has a wallet
    const { data: existingWallet } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('chain', 'ethereum')
      .single()

    if (existingWallet) {
      console.log('Wallet already exists for user')
      return new Response(
        JSON.stringify({ 
          wallet_address: existingWallet.wallet_address,
          chain: existingWallet.chain
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Create a new wallet
    const wallet = Wallet.createRandom()
    const address = wallet.address
    const privateKey = wallet.privateKey

    console.log('Generated wallet address:', address)

    // Simple encryption (in production, use more robust encryption)
    const encryptionKey = Deno.env.get('WALLET_ENCRYPTION_KEY') ?? ''
    const encoder = new TextEncoder()
    const data = encoder.encode(privateKey + encryptionKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const encryptedKey = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Store the wallet in the database using service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: walletData, error: walletError } = await supabaseAdmin
      .from('wallets')
      .insert({
        user_id: user.id,
        wallet_address: address,
        encrypted_private_key: encryptedKey,
        chain: 'ethereum',
        balance: '0'
      })
      .select()
      .single()

    if (walletError) {
      console.error('Error storing wallet:', walletError)
      return new Response(
        JSON.stringify({ error: 'Failed to create wallet', details: walletError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Wallet created successfully')

    return new Response(
      JSON.stringify({ 
        wallet_address: address,
        chain: 'ethereum'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in create-wallet function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})