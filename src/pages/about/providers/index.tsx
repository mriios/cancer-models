import { promises as fs } from "fs";
import matter from "gray-matter";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import React from "react";
import Button from "../../../components/Button/Button";
import Card from "../../../components/Card/Card";
import Loader from "../../../components/Loader/Loader";
import ProviderInfo from "../../../components/ProviderInfo/ProviderInfo";
import { useActiveProject } from "../../../hooks/useActiveProject";
import projectsSettings from "../../../utils/projectSettings.json";

type ProvidersProps = {
	allProvidersBasics: {
		id: string;
		parsedContent: string;
		abbreviation: string;
		logo: string;
		name: string;
	}[];
};

type ProjectButtonProps = {
	projectName: string;
	isActive: boolean;
	mainColor: string;
	secondaryColor: string;
	onClick: () => void;
	direction?: ProjectButtonsProps["direction"];
};

type ProjectButtonsProps = {
	direction?: "row" | "column";
	activeProject: string;
	onClick: (projectName: string) => void;
};

const getButtonStyleColors = (
	isActive: boolean,
	mainColor: string,
	secondaryColor: string
) => {
	return isActive
		? { backgroundColor: mainColor, color: secondaryColor }
		: { backgroundColor: "#ebebeb", color: "#003e48" };
};

const handleMouseEnter = (
	e: React.MouseEvent<HTMLElement>,
	isActive: boolean,
	mainColor: string,
	secondaryColor: string
) => {
	if (!isActive) {
		const target = e.target as HTMLElement;
		target.style.backgroundColor = mainColor;
		target.style.color = secondaryColor;
	}
};

const handleMouseLeave = (
	e: React.MouseEvent<HTMLElement>,
	isActive: boolean
) => {
	if (!isActive) {
		const target = e.target as HTMLElement;
		target.style.backgroundColor = "#ebebeb";
		target.style.color = "#003e48";
	}
};

const ProjectButton = ({
	projectName,
	isActive,
	mainColor,
	secondaryColor,
	onClick,
	direction
}: ProjectButtonProps) => {
	const buttonColors = getButtonStyleColors(
		isActive,
		mainColor,
		secondaryColor
	);

	return (
		<Button
			priority="secondary"
			color="dark"
			className={`w-100 mx-0 mt-0 mb-1 border-none justify-content-center ${
				direction === "row" ? "my-md-3" : "mt-lg-0"
			}`}
			style={{ flex: "1 1 0", ...buttonColors }}
			onMouseEnter={(e) =>
				handleMouseEnter(e, isActive, mainColor, secondaryColor)
			}
			onMouseLeave={(e) => handleMouseLeave(e, isActive)}
			onClick={onClick}
		>
			{projectName}
		</Button>
	);
};

const Header = () => (
	<header className="bg-primary-primary text-white mb-5 py-5">
		<div className="container">
			<div className="row py-5">
				<div className="col-12">
					<h1 className="m-0">Our data providers</h1>
				</div>
			</div>
		</div>
	</header>
);

export const ProjectButtons = ({
	activeProject,
	onClick,
	direction
}: ProjectButtonsProps) => (
	<div
		className={`d-flex flex-column align-md-center justify-content-between ${
			direction === "row" ? "flex-md-row" : ""
		}`}
		style={{ columnGap: "1rem" }}
	>
		{projectsSettings.map(
			({
				project_abbreviation,
				project_settings: { main_color, secondary_color }
			}) => (
				<ProjectButton
					key={project_abbreviation}
					projectName={project_abbreviation}
					isActive={activeProject === project_abbreviation}
					mainColor={main_color}
					secondaryColor={secondary_color}
					onClick={() => onClick(project_abbreviation)}
					direction={direction}
				/>
			)
		)}
	</div>
);

const Providers: NextPage<ProvidersProps> = ({ allProvidersBasics }) => {
	const { activeProjectData, isLoadingProviders, handleProjectClick } =
		useActiveProject();

	const activeProviderBasics = allProvidersBasics.filter((providerBasic) =>
		activeProjectData.providers?.some(
			(provider) => provider?.data_source === providerBasic.abbreviation
		)
	);

	return (
		<>
			<Header />
			{/* Decided to move this here instead of outside this return so Header doesn't blink */}
			{activeProjectData.project_abbreviation === null ? (
				<div style={{ height: "50vh" }}>
					<Loader />
				</div>
			) : (
				<section className="pt-0">
					<div className="container">
						<div className="row mb-5">
							<div className="col-12">
								<ProjectButtons
									direction="row"
									activeProject={activeProjectData.project_abbreviation}
									onClick={handleProjectClick}
								/>
							</div>
						</div>
						{activeProjectData.project_description &&
							activeProjectData.project_settings.logo && (
								<div className="row mb-5 justify-content-center">
									<div className="col-12 col-lg-8">
										<Card
											contentClassName="py-4"
											header={
												<h2 className="m-0">
													{activeProjectData.project_full_name ??
														activeProjectData.project_abbreviation}
												</h2>
											}
										>
											<div className="row">
												<div className="col-8 offset-2 col-md-3 offset-md-0">
													<Image
														src={activeProjectData.project_settings.logo}
														alt={`${activeProjectData.project_abbreviation} logo`}
														width={150}
														height={150}
														className="w-100 h-auto mx-auto mb-2"
													/>
												</div>
												<div className="col-12 col-md-9">
													<p>{activeProjectData.project_description}</p>
													<p>
														<Link
															href={`/search?filters=project_name%3A${activeProjectData.project_abbreviation}`}
														>
															Explore project&apos;s models
														</Link>
													</p>
												</div>
											</div>
										</Card>
									</div>
								</div>
							)}
						<div className="row">
							{isLoadingProviders ? (
								<div style={{ height: "50vh" }}>
									<Loader />
								</div>
							) : (
								activeProviderBasics?.map((provider) => (
									<ProviderInfo key={provider.id} provider={provider} />
								))
							)}
						</div>
					</div>
				</section>
			)}
		</>
	);
};

export default Providers;

export const getStaticProps: GetStaticProps = async () => {
	const providersDirectory = path.join(
		process.cwd(),
		"/public/static/providers"
	);
	const providersFiles = await fs.readdir(providersDirectory);

	const allProvidersBasicsFirst = providersFiles.map(
		async (providerFile: string) => {
			const fullPath = path.join(providersDirectory, providerFile);
			const fileContents = await fs.readFile(fullPath, "utf8");
			const matterResult = await matter(fileContents);

			return {
				id: providerFile.replace(/\.md$/, "") as string,
				...(matterResult.data as {
					abbreviation: string;
					logo: string;
					name: string;
				})
			};
		}
	);

	return {
		props: {
			allProvidersBasics: await Promise.all(allProvidersBasicsFirst)
		}
	};
};
