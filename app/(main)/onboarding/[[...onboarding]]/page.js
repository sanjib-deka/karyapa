"use client";
import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
	const { organization } = useOrganization();
	const router = useRouter();

	useEffect(() => {
		if (organization) {
			router.push(`/organizations/${organization.slug}`);
		}
	}, [organization]);

	return (
		<div className="flex justify-center items-center pt-14">
			<OrganizationList
				hidePersonal
				afterCreateOrganizationUrl={"/organizations/:slug"}
				afterSelectOrganizationUrl={"/organizations/:slug"}
			/>
		</div>
	);
};

export default Page;
