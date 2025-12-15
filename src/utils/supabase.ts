import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type UserData = {
  quiz1Score?: number;
  quiz2Score?: number;
  quiz3Score?: number;
  essay1Answer?: string;
  essay2Answer?: string;
};

export async function saveAllUserData(
  personId: string,
  data: UserData
) {
  console.log('Saving all user data for:', personId);
  
  try {
    // First check if a record exists for this user
    const { data: existingRecord, error: fetchError } = await supabase
      .from('da_score')
      .select('id, person')
      .eq('person', personId)
      .maybeSingle();

    // Prepare the data to be saved
    const saveData = {
      person: personId,
      quiz_one_score: data.quiz1Score ?? null,
      quiz_two_score: data.quiz2Score ?? null,
      quiz_three_score: data.quiz3Score ?? null,
      essay1_answer: data.essay1Answer ?? null,
      essay2_answer: data.essay2Answer ?? null,
      created_at: new Date().toISOString()
    };

    let result;
    
    if (existingRecord) {
      // Update existing record
      console.log('Updating existing record for user:', personId);
      const { data: updatedData, error: updateError } = await supabase
        .from('da_score')
        .update(saveData)
        .eq('person', personId)
        .select();
      
      if (updateError) throw updateError;
      result = updatedData;
    } else {
      // Create new record if none exists
      console.log('Creating new record for user:', personId);
      const { data: insertedData, error: insertError } = await supabase
        .from('da_score')
        .insert([{ ...saveData, created_at: new Date().toISOString() }])
        .select();
      
      if (insertError) throw insertError;
      result = insertedData;
    }

    console.log('User data saved successfully:', result);
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error saving user data:', {
      error,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code
    });
    return { data: null, error };
  }
}


export async function savePersonalDetails(name: string, email: string) {
  console.log('Attempting to save to Supabase...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Processing email:', normalizedEmail);
    
    // Check if user with this email already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('da_personal_details')
      .select('id, name')
      .eq('email', normalizedEmail)
      .maybeSingle();
      
    if (fetchError) {
      console.error('Error checking for existing user:', fetchError);
      throw fetchError;
    }
    
    // If user exists, return existing user data
    if (existingUser) {
      console.log('User with this email already exists:', existingUser);
      // Update name if it's different
      if (existingUser.name !== name) {
        console.log('Updating user name from', existingUser.name, 'to', name);
        const { error: updateError } = await supabase
          .from('da_personal_details')
          .update({ name })
          .eq('id', existingUser.id);
          
        if (updateError) {
          console.error('Error updating user name:', updateError);
          throw updateError;
        }
      }
      return { id: existingUser.id, email: normalizedEmail };
    }
    
    // If no existing user, create a new one
    console.log('Creating new user with data:', { name, email: normalizedEmail });
    const { data: newUser, error: insertError } = await supabase
      .from('da_personal_details')
      .insert([
        { name, email: normalizedEmail },
      ])
      .select('id, email')
      .single();
      
    if (insertError) {
      console.error('Error creating new user:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      throw insertError;
    }
    
    console.log('New user created successfully:', newUser);
    return newUser;
  } catch (error) {
    console.error('Unexpected error in savePersonalDetails:', error);
    throw error;
  }
}
