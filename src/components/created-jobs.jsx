import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import JobCard from "./job-card";
import { BarLoader } from "react-spinners";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  return (
    <div>
      {loadingCreatedJobs ? (
        <div className="fixed top-16 left-0 w-full z-50">
          <BarLoader width={"100%"} color="#FACC15" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {createdJobs?.length ? (
            createdJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onJobSaved={fnCreatedJobs}
                isMyJob
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              No jobs found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
