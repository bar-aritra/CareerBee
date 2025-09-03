import { useUser } from "@clerk/clerk-react";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteJob, saveJob } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const {
    fn: fnSavedJob,
    data: savedJob,
    loading: loadingSavedJob,
  } = useFetch(saveJob, { alreadySaved: saved });

  const { user } = useUser();

  const handleSaveJob = async () => {
    await fnSavedJob({ job_id: job.id, user_id: user.id });
    onJobSaved();
  };

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobSaved();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="flex flex-col relative overflow-hidden">
      {loadingDeleteJob && (
        <div className="absolute top-0 left-0 w-full">
          <BarLoader color="#FACC15" width={"100%"} />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              color="#ef4444"
              size={18}
              className="cursor-pointer hover:opacity-80 transition-opacity text-red-300"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {job.company?.logo_url && (
            <img
              src={job.company.logo_url}
              alt={job.company?.name}
              className="h-6"
            />
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
          <MapPinIcon color="#FACC15" size={15} />
          <span className="text-white">{job.location}</span>
        </div>

        <hr className="my-2" />

        {job.description && (
          <p className="text-sm text-muted-foreground">
            {job.description.split(".")[0]}.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="ghost"
            className="w-10"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={18} stroke="#ef4444" fill="#ef4444" />
            ) : (
              <Heart size={18} stroke="#ef4444" fill="none" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
