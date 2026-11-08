import { supabase } from "./supabase";

export async function saveInvestigation(type, input, result) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("investigations")
    .insert([
      {
        user_id: user.id,
        type,
        input,
        result,
      },
    ]);

  if (error) {
    console.error("Error saving investigation:", error.message);
  }
}