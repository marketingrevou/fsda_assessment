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

// Define the UserAnswer type
type UserAnswer = {
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
  correctAnswer: string;
  timestamp: string;
};

type UserAnswers = Record<string, UserAnswer>;

// Helper function to calculate score for a specific quiz
export const calculateQuizScore = (userAnswers: UserAnswers, quizNumber: number): number => {
  // Get all answers for this quiz
  const quizAnswers = Object.entries(userAnswers)
    .filter(([key, value]) => {
      // Match both questionId format (Quiz1Q1) and direct key format (Quiz1Q1)
      const isQuizQuestion = key.startsWith(`Quiz${quizNumber}Q`);
      const hasQuestionId = value?.questionId?.startsWith(`Quiz${quizNumber}Q`);
      return (isQuizQuestion || hasQuestionId) && value && value.isCorrect !== undefined;
    })
    .map(([_, value]) => value);
  
  console.log(`Quiz ${quizNumber} answers:`, quizAnswers);
  
  // Count correct answers
  const score = quizAnswers.reduce((count: number, answer) => {
    if (answer === null || answer === undefined) return count;
    
    // Check if answer has isCorrect property
    if (typeof answer === 'object' && 'isCorrect' in answer) {
      return count + (answer.isCorrect ? 1 : 0);
    }
    
    return count;
  }, 0);
  
  console.log(`Quiz ${quizNumber} score:`, score);
  return score;
};

export async function saveAllUserData(
  personId: string,
  data: UserData
) {
  console.log('Saving all user data:', {
    personId,
    data
  });
  
  try {
    // First check if a record exists for this user
    const { data: existingRecord, error: fetchError } = await supabase
      .from('da_score')
      .select('id, person')
      .eq('person', personId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching existing record:', fetchError);
      throw fetchError;
    }

    // Get scores from data object or fall back to localStorage
    const getStoredScore = (quizNumber: number, defaultScore: number = 0): number => {
      // First try to get from data object
      const scoreFromData = data[`quiz${quizNumber}Score` as keyof UserData];
      if (scoreFromData !== undefined) return scoreFromData as number;
      
      // If not in data, try to get from localStorage
      if (typeof window !== 'undefined') {
        const storedScore = localStorage.getItem(`quiz${quizNumber}Score`);
        return storedScore ? parseInt(storedScore, 10) : defaultScore;
      }
      
      return defaultScore;
    };

    const quiz1Score = getStoredScore(1);
    const quiz2Score = getStoredScore(2);
    const quiz3Score = getStoredScore(3);
    
    console.log('Final scores being saved:', { quiz1Score, quiz2Score, quiz3Score });

    console.log('Scores from props:', { quiz1Score, quiz2Score, quiz3Score });

    // Prepare the data to be saved
    const saveData = {
      person: personId,
      quiz_one_score: quiz1Score,
      quiz_two_score: quiz2Score,
      quiz_three_score: quiz3Score,
      essay1_answer: data.essay1Answer ?? '',
      essay2_answer: data.essay2Answer ?? '',
      created_at: new Date().toISOString()
    };

    console.log('Saving scores to database:', {
      quiz1Score,
      quiz2Score,
      quiz3Score,
      saveData
    });

    let result;
    
    if (existingRecord) {
      console.log('Updating existing record with data:', saveData);
      const { data: updatedData, error: updateError } = await supabase
        .from('da_score')
        .update(saveData)
        .eq('person', personId)
        .select();
      
      if (updateError) {
        console.error('Error updating record:', updateError);
        throw updateError;
      }
      result = updatedData;
    } else {
      console.log('Creating new record with data:', saveData);
      const { data: insertedData, error: insertError } = await supabase
        .from('da_score')
        .insert([{ 
          ...saveData, 
          created_at: new Date().toISOString() 
        }])
        .select();
      
      if (insertError) {
        console.error('Error creating record:', insertError);
        throw insertError;
      }
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
