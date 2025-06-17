"use client";
import { updateSprintStatus } from "@/actions/sprints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import React from "react";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {
	const [status, setStatus] = useState(sprint.status);

	const startDate = new Date(sprint.startDate);
	const endDate = new Date(sprint.endDate);
	const now = new Date();

	const searchParams = useSearchParams();
	const router = useRouter();

	const canStart =
		isBefore(now, endDate) &&
		isAfter(now, startDate) &&
		status === "PLANNED";

	const canEnd = status === "ACTIVE";

	const {
		fn: updateStatus,
		loading,
		error,
		data: updatedStatus,
	} = useFetch(updateSprintStatus);

	const handleStatusChange = (newStatus) => {
		updateStatus(sprint.id, newStatus);
	};

	useEffect(() => {
		if (updatedStatus && updatedStatus.success) {
			setStatus(updatedStatus.sprint.status);
			setSprint({
				...sprint,
				status: updatedStatus.sprint.status,
			});
		}
	}, [updatedStatus, loading]);

	useEffect(() => {
		const sprintId = searchParams.get("sprint");
		if (sprintId && sprintId !== sprint.id) {
			const selectedSprint = sprints.find((s) => s.id === sprintId);
			if (selectedSprint) {
				setSprint(selectedSprint);
				setStatus(selectedSprint.status);
			}
		}
	}, [searchParams, sprints]);

	const handleSprintChange = (value) => {
		const selectedSprint = sprints.find((s) => s.id === value);
		setSprint(selectedSprint);
		setStatus(selectedSprint.status);
		router.replace(`/project/${projectId}`, undefined, { shallow: true });
	};

	const getStatusText = () => {
		if (status === "COMPLETED") {
			return "Sprint Ended";
		}
		if (status === "ACTIVE" && isAfter(now, endDate)) {
			return `Overdue by ${formatDistanceToNow(endDate)}`;
		}
		if (status === "PLANNED" && isBefore(now, startDate)) {
			return `Starts in ${formatDistanceToNow(startDate)}`;
		}
		return null;
	};

	return (
		<>
			<div className="flex justify-between items-center gap-4">
				<Select value={sprint.id} onValueChange={handleSprintChange}>
					<SelectTrigger className="bg-gray-200 text-gray-900 self-start">
						<SelectValue placeholder="Select Sprint" />
					</SelectTrigger>
					<SelectContent>
						{sprints.map((sprint) => (
							<SelectItem key={sprint.id} value={sprint.id}>
								{sprint.name} (
								{format(sprint.startDate, "MMM d, yyyy")}) to{" "}
								{format(sprint.endDate, "MMM d, yyyy")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{canStart && (
					<Button
						className="bg-green-500 text-white"
						onClick={() => handleStatusChange("ACTIVE")}
						disabled={loading}
					>
						Start Sprint
					</Button>
				)}
				{canEnd && (
					<Button
						variant="destructive"
						className="bg-red-500 text-white"
						onClick={() => handleStatusChange("COMPLETED")}
						disabled={loading}
					>
						End Sprint
					</Button>
				)}
			</div>

			{loading && (
				<BarLoader color="#36d7b7" className="mt-2" width={"100%"} />
			)}

			{getStatusText() && (
				<Badge className="mt-3 ml-1 self-start bg-blue-100 text-blue-800">
					{getStatusText()}
				</Badge>
			)}
		</>
	);
};

export default SprintManager;
