import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = React.useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          <Link to="/">
            <img
              src="/CareerB_logo.png"
              alt="logo"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <div className="flex gap-8">
            <SignedOut>
              <Button variant="outline" onClick={() => setShowSignIn(true)}>
                Login
              </Button>
            </SignedOut>
            <SignedIn>
              {user?.unsafeMetadata?.role === "recruiter" && (
                <Link to="/post-job">
                  <Button variant="destructive">
                    <PenBox size={20} className="mr-2" />
                    Post a Job
                  </Button>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-10 w-10" },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  />
                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>
        </nav>
      </header>
      {showSignIn && (
        <div className="fixed inset-0 z-50" onClick={handleOverlayClick}>
          <div
            className="absolute right-4 mt-2 z-50"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
