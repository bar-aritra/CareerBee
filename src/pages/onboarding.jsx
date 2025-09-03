import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        console.log(`Role updated to ${role}`);
        navigateUser(role);
      })
      .catch((err) => {
        console.error("Error updating user role:", err);
      });
  };

  useEffect(() => {
    if (!isLoaded) return; // ✅ prevents infinite loop

    const role = user?.unsafeMetadata?.role;
    if (role) {
      navigateUser(role);
    }
  }, [isLoaded]); // ✅ only run once when Clerk is loaded

  if (!isLoaded) {
    return (
      <div className="fixed top-16 left-0 w-full z-50">
        <BarLoader width="100%" color="#FACC15" />
      </div>
    );
  }

  return (
    <div className="pt-20">
      <h2 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl text-center mb-10">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="apply"
          className="h-30 text-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="post"
          className="h-30 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
