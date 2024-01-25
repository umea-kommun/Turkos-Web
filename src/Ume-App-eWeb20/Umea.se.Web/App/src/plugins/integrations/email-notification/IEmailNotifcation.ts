export default interface IEmailNotification {
	id: number;
	title?: string;
	type: string;
	subject: string;
	body: string;
}
