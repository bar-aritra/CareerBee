import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    fn: fnSavedJobs,
    data: savedJobs,
    loading: loadingSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return (
      <div className="fixed top-16 left-0 w-full z-50">
        <BarLoader width="100%" color="#FACC15" />
      </div>
    );
  }

  return (
    <div className="pt-20 px-4">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>
      {loadingSavedJobs === false && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {savedJobs?.length ? (
            savedJobs.map((saved) => (
              <JobCard
                key={saved.id}
                job={saved.job}
                savedInit={true}
                onJobSaved={fnSavedJobs}
              />
            ))
          ) : (
            <div className="col-span-full text-center">
              No Saved Jobs Found...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
