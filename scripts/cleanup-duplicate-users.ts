import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or Anon Key in environment variables');
  console.log('Make sure your .env file contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Initialize Supabase client
console.log('Initializing Supabase client with URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  email: string;
  created_at: string;
  name?: string;
}

async function findDuplicateEmails(): Promise<string[]> {
  console.log('Searching for duplicate emails...');
  
  // First, get all emails
  const { data, error } = await supabase
    .from('da_personal_details')
    .select('email')
    .not('email', 'is', null)
    .not('email', 'eq', '')
    .order('email');

  if (error) {
    console.error('Error finding duplicate emails:', error);
    return [];
  }

  // Group by email and find duplicates
  const emailCounts = new Map<string, number>();
  data?.forEach(user => {
    const count = emailCounts.get(user.email) || 0;
    emailCounts.set(user.email, count + 1);
  });

  // Return only emails that appear more than once
  return Array.from(emailCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([email]) => email);
}

async function cleanupDuplicateUsers() {
  console.log('Starting cleanup of duplicate users...');

  try {
    // Find all duplicate emails
    const duplicateEmails = await findDuplicateEmails();

    if (duplicateEmails.length === 0) {
      console.log('No duplicate emails found.');
      return;
    }

    console.log(`Found ${duplicateEmails.length} duplicate email(s) to process.`);

    // Process each duplicate email
    for (const email of duplicateEmails) {
      console.log(`\nProcessing duplicates for email: ${email}`);
      
      // Get all users with this email, ordered by creation date (oldest first)
      const { data: users, error: usersError } = await supabase
        .from('da_personal_details')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: true });

      if (usersError) {
        console.error(`Error fetching users for email ${email}:`, usersError);
        continue;
      }

      if (!users || users.length <= 1) continue;

      // The first user (oldest) will be kept, others will be merged into it
      const userToKeep = users[0];
      const usersToMerge = users.slice(1);

      console.log(`  Keeping user ID: ${userToKeep.id} (created at ${userToKeep.created_at})`);
      console.log(`  Found ${usersToMerge.length} duplicate(s) to merge`);

      // Update all references in da_score table and merge essay answers
      for (const user of usersToMerge) {
        console.log(`  Updating references from user ${user.id} to ${userToKeep.id}`);
        
        // Check if the target user already has a score record
        const { data: existingScore, error: checkError } = await supabase
          .from('da_score')
          .select('id')
          .eq('person', userToKeep.id)
          .maybeSingle();

        // If the target user doesn't have a score record, update references
        if (checkError || !existingScore) {
          const { error: updateError } = await supabase
            .from('da_score')
            .update({ person: userToKeep.id })
            .eq('person', user.id);

          if (updateError) {
            console.error(`    Error updating scores for user ${user.id}:`, updateError);
          } else {
            console.log(`    Updated score references from user ${user.id} to ${userToKeep.id}`);
          }
        } else {
          console.log(`    Target user ${userToKeep.id} already has a score record, skipping update`);
        }

        // Merge essay answers if the kept user doesn't have them but the duplicate does
        const updates: Record<string, any> = {};
        
        if (!userToKeep.essay1_answer && user.essay1_answer) {
          updates.essay1_answer = user.essay1_answer;
          console.log(`    Merging essay1_answer from user ${user.id}`);
        }
        
        if (!userToKeep.essay2_answer && user.essay2_answer) {
          updates.essay2_answer = user.essay2_answer;
          console.log(`    Merging essay2_answer from user ${user.id}`);
        }

        // If we have any updates to make to the kept user
        if (Object.keys(updates).length > 0) {
          const { error: updateUserError } = await supabase
            .from('da_personal_details')
            .update(updates)
            .eq('id', userToKeep.id);

          if (updateUserError) {
            console.error(`    Error updating user ${userToKeep.id} with essay answers:`, updateUserError);
          } else {
            console.log(`    Successfully merged essay answers to user ${userToKeep.id}`);
          }
        }

        // Delete the duplicate user
        const { error: deleteError } = await supabase
          .from('da_personal_details')
          .delete()
          .eq('id', user.id);

        if (deleteError) {
          console.error(`    Error deleting user ${user.id}:`, deleteError);
        } else {
          console.log(`    Successfully merged and deleted duplicate user ${user.id}`);
        }
      }
    }

    console.log('\nCleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupDuplicateUsers().catch(console.error);
