interface JobIdPageProps {
  params: Promise<{ jobId: string }>;
}

const JobIdPage = async ({ params }: JobIdPageProps) => {
  const { jobId } = await params;

  return <div>Job ID: {jobId}</div>;
};

export default JobIdPage;
