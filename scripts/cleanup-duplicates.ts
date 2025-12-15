import { supabase } from '../src/utils/supabase';

interface User {
  id: string;
  email: string;
  created_at: string;
  name?: string;
}

async function findDuplicateEmails(): Promise<string[]> {
  console.log('Searching for duplicate emails...');
  
  // Get all emails
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
      await processDuplicateEmail(email);
    }

    console.log('\nCleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

async function processDuplicateEmail(email: string) {
  console.log(`\nProcessing duplicates for email: ${email}`);
  
  // Get all users with this email, ordered by creation date (oldest first)
  const { data: users, error: usersError } = await supabase
    .from('da_personal_details')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: true });

  if (usersError) {
    console.error(`Error fetching users for email ${email}:`, usersError);
    return;
  }

  if (!users || users.length <= 1) {
    console.log(`No duplicates found for email: ${email}`);
    return;
  }

  // The first user (oldest) will be kept, others will be merged into it
  const userToKeep = users[0];
  const usersToMerge = users.slice(1);

  console.log(`  Keeping user ID: ${userToKeep.id} (created at ${userToKeep.created_at})`);
  console.log(`  Found ${usersToMerge.length} duplicate(s) to merge`);

  // Process each duplicate user
  for (const user of usersToMerge) {
    await mergeUserInto(user, userToKeep);
  }
}

async function mergeUserInto(sourceUser: User, targetUser: User) {
  console.log(`  Merging user ${sourceUser.id} into ${targetUser.id}`);
  
  try {
    // Check if target user already has a score record
    const { data: targetScore, error: checkError } = await supabase
      .from('da_score')
      .select('id')
      .eq('person', targetUser.id)
      .maybeSingle();

    // If target doesn't have a score record, update references
    if (checkError || !targetScore) {
      const { error: updateError } = await supabase
        .from('da_score')
        .update({ person: targetUser.id })
        .eq('person', sourceUser.id);

      if (updateError) {
        throw updateError;
      }
      console.log(`    Moved score records from ${sourceUser.id} to ${targetUser.id}`);
    } else {
      console.log(`    Target user ${targetUser.id} already has a score record, skipping update`);
    }

    // Delete the duplicate user
    const { error: deleteError } = await supabase
      .from('da_personal_details')
      .delete()
      .eq('id', sourceUser.id);

    if (deleteError) {
      throw deleteError;
    }

    console.log(`    Successfully deleted duplicate user ${sourceUser.id}`);
  } catch (error) {
    console.error(`    Error merging user ${sourceUser.id}:`, error);
  }
}

// Run the cleanup
cleanupDuplicateUsers().catch(console.error);
