import { getJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useMemo } from "react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/job-card";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
    page,
    limit,
  });

  const { fn: fnCompanies, data: companies = [] } = useFetch(getCompanies);

  const totalPages = useMemo(() => {
    if (!jobs?.extra?.totalCount || !jobs?.extra?.limit) return 1;
    return Math.ceil(jobs.extra.totalCount / jobs.extra.limit);
  }, [jobs]);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, searchQuery, location, company_id, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    setSearchQuery(query || "");
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
    setPage(1);
  };

  if (!isLoaded) {
    return (
      <div className="fixed top-16 left-0 w-full z-50">
        <BarLoader width="100%" color="#FACC15" />
      </div>
    );
  }

  return (
    <div className="pt-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl pb-8">
          Latest Job Listings
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex justify-center mb-6 w-full"
        >
          <div className="flex w-full max-w-2xl gap-2">
            <Input
              type="text"
              placeholder="Search Jobs by Title.."
              name="search-query"
              className="flex-1 px-4 py-3 text-base sm:text-lg rounded-l-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
            <Button type="submit" className="rounded-r-lg" variant="apply">
              Search
            </Button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-12 w-full max-w-3xl mx-auto">
          <Select
            value={location}
            onValueChange={(value) => setLocation(value)}
          >
            <SelectTrigger className="flex-1 h-[48px] rounded-lg shadow-md border border-gray-300">
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={company_id}
            onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger className="flex-1 h-[48px] rounded-lg shadow-md border border-gray-300">
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies.map(({ name, id }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="destructive" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>

        {/* Job Grid */}
        {loadingJobs && (
          <BarLoader color="#FACC15" width={"100%"} className="mt-4" />
        )}

        {!loadingJobs && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {jobs?.data?.length ? (
              jobs.data.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              ))
            ) : (
              <div className="col-span-full text-center">
                No jobs found matching your criteria.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent className="flex gap-1.5">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListing;
