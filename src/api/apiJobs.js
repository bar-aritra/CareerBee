import supabaseClient from "@/utils/supabase";

export async function getJobs(
  token,
  { location, company_id, searchQuery, page = 1, limit = 6 }
) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select(
      "*, company:jobs_company_id_fkey(name,logo_url),saved:saved_jobs_job_id_fkey(id)",
      { count: "exact" }
    );

  if (location && location.trim() !== "") {
    query = query.eq("location", location);
  }

  if (company_id && company_id.trim() !== "") {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery && searchQuery.trim() !== "") {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Error fetching jobs:", error);
    return { data: [], extra: { totalCount: 0, page, limit } };
  }
  return {
    data: data ?? [],
    extra: { totalCount: count ?? 0, page, limit },
  };
}

export async function saveJob(token, { alreadySaved }, savedData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", savedData.job_id);

    if (deleteError) {
      console.error("Error deleting saved job:", deleteError);
      return data;
    }
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([savedData])
      .select();

    if (insertError) {
      console.error("Error fetching jobs:", insertError);
      return data;
    }
    return data;
  }
}

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "*, company:jobs_company_id_fkey(name,logo_url),applications : applications(*)"
    )
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching job:", error);
    return null;
  }
  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error updating hiring status:", error);
    return null;
  }
  return data;
}
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Error Creating Job", error);
    return null;
  }
  return data;
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*,job:jobs(*,company:companies(name,logo_url))");

  if (error) {
    console.error("Error Fetching Saved Jobs", error);
    return null;
  }
  return data;
}
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*,company:companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error Fetching Jobs", error);
    return null;
  }
  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Deleting Job", error);
    return null;
  }
  return data;
}
