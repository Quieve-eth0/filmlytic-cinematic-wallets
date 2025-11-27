-- Add INSERT policy for wallets table to prevent unauthorized wallet creation
CREATE POLICY "Users can insert their own wallet" 
ON public.wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);