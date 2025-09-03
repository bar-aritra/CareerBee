import {
  BookOpenText,
  BoxesIcon,
  BriefcaseBusiness,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { updateApplicationsStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationsStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status);
  };

  return (
    <Card className="relative overflow-hidden">
      {loadingHiringStatus && (
        <div className="absolute top-0 left-0 right-0">
          <BarLoader width={"100%"} color="#FACC15" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.candidate?.name || "Unknown Candidate"}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} />
            {application?.experience} years of experience
          </div>
          <div className="flex gap-2 items-center">
            <BookOpenText size={15} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <BoxesIcon size={15} />
            {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>
          {new Date(application?.created_at).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            hour12: true,
          })}
        </span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
