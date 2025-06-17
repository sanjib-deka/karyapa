import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

const layout = async ({ children }) => {
	return (
		<div>
			<Suspense fallback={<BarLoader width={"100%"} color="#36d7b7" />}>
				{children}
			</Suspense>
		</div>
	);
};

export default layout;
