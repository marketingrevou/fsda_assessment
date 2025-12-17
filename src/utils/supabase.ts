import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveEssayAnswer = async (userId: string, essayNumber: number, answer: string) => {
  try {
    const { data, error } = await supabase
      .from('user_answers')
      .upsert(
        { 
          user_id: userId, 
          [`essay${essayNumber}_answer`]: answer,
          updated_at: new Date().toISOString()
        },
        { 
          onConflict: 'user_id'
        }
      )
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving essay answer:', error);
    return { data: null, error };
  }
};

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
    // Always create a new record to allow multiple submissions
    console.log('Creating new submission record for user:', personId);

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

    // Always create a new record with the current timestamp
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
    
    const result = insertedData;

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
    console.log('Creating new user with email:', normalizedEmail);
    
    // Always create a new user record
    const { data: newUser, error: insertError } = await supabase
      .from('da_personal_details')
      .insert([{ name, email: normalizedEmail }])
      .select()
      .single();
      
    if (insertError) {
      console.error('Error creating new user:', insertError);
      throw insertError;
    }
    
    console.log('New user created:', newUser);
    return { data: newUser, error: null };
  } catch (error) {
    console.error('Unexpected error in savePersonalDetails:', error);
    return { data: null, error };
  }
}
