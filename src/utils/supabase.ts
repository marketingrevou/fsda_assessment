import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveQuizScores(personId: string, quiz1Score: number, quiz2Score: number, quiz3Score: number) {
  console.log('Attempting to save quiz scores to Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('da_score')
      .insert([
        { 
          person: personId,  // This should match the foreign key column name in your database
          quiz_one_score: quiz1Score,
          quiz_two_score: quiz2Score,
          quiz_three_score: quiz3Score,
          created_at: new Date().toISOString()
        },
      ])
      .select();

    if (error) throw error;
    console.log('Quiz scores saved successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error saving quiz scores:', error);
    return { data: null, error };
  }
}

export async function savePersonalDetails(name: string, email: string) {
  console.log('Attempting to save to Supabase...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    console.log('Inserting data:', { name, email });
    const { data, error, status } = await supabase
      .from('da_personal_details')
      .insert([
        { name, email },
      ])
      .select('id, email')
      .single();
      
    if (error) throw error;
    
    // Save both email and user ID to localStorage
    if (typeof window !== 'undefined' && data) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', data.id);
      console.log('Saved user data to localStorage:', { email, id: data.id });
    }

    console.log('Supabase response status:', status);
    
    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    
    console.log('Successfully saved to Supabase:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error in savePersonalDetails:', error);
    throw error;
  }
}
