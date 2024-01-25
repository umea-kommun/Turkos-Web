class Config {
	constructor() {
		const transpiledEnvVars = import.meta.env; // This forces the transpiler to expose all env variables
		Object.assign(this, transpiledEnvVars);
	}
	public loadVarsFromServer(serverEnvVars: object): void {
		Object.assign(this, this, serverEnvVars || {});
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default new Config() as any;
