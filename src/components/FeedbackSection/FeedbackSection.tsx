import Button from "../Button/Button";
import Card from "../Card/Card";
import Form from "../Form/Form";
import InputAndLabel from "../Input/InputAndLabel";

type FeedbackSectionProps = { backgroundColor: "light" | "dark" | "white" };

const FeedbackSection = (props: FeedbackSectionProps) => {
	let backgroundColorClass = null;

	switch (props.backgroundColor) {
		case "light":
			backgroundColorClass = "bg-primary-quaternary";
			break;
		case "dark":
			backgroundColorClass = "bg-primary-primary";
			break;
		case "white":
			backgroundColorClass = "bg-white";
			break;
	}

	return (
		<>
			<section className={backgroundColorClass}>
				<div className="container my-5">
					<div className="row">
						<div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
							<Card className="bg-white text-center">
								<h2 className="mt-0">Feedback</h2>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit.
									Explicabo temporibus nihil unde.
								</p>
								<Form onSubmit={() => console.log("Feedback submit")}>
									<div className="row">
										<InputAndLabel
											forId="name"
											id="name"
											label="Name"
											name="name-name"
											type="text"
											placeholder="Your complete name"
											className="col-xl-6"
										/>
										<InputAndLabel
											forId="email"
											id="email"
											label="E-mail"
											name="email-name"
											type="email"
											placeholder="Your email address"
											className="col-xl-6"
										/>
									</div>
									<InputAndLabel
										forId="message"
										id="message"
										label="Message"
										name="message-name"
										type="textarea"
										placeholder="Your feedback"
									/>
									<div className="text-right">
										<Button
											color="dark"
											priority="primary"
											className="m-0 mt-1"
											type="submit"
										>
											Send feedback
										</Button>
									</div>
								</Form>
							</Card>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default FeedbackSection;
