import Axios from 'axios';
import { dataSourceSpecOutPutMock, IDataSourceSpecification } from './models';

export default class DataSourceOutPutApplier {
	private useMockData: boolean;
	private dataServiceSpecOutPutUrl: URL | null;
	private dataSourceSpecifications: IDataSourceSpecification[] | null = null;

	constructor({ dataServiceSpecOutPutUrl, useMockData }: any) {
		this.useMockData = useMockData;
		this.dataServiceSpecOutPutUrl = useMockData
			? null
			: new URL(dataServiceSpecOutPutUrl);
	}

	public async fetchDataSourceSpecificationsOutPut(): Promise<
		IDataSourceSpecification[]
	> {
		if (!this.dataSourceSpecifications) {
			if (this.useMockData) {
				this.dataSourceSpecifications = dataSourceSpecOutPutMock;
			} else if (this.dataServiceSpecOutPutUrl) {
				const response = await Axios.get(
					this.dataServiceSpecOutPutUrl.toString()
				);
				this.dataSourceSpecifications = response.data;
			}
		}
		return this.dataSourceSpecifications as IDataSourceSpecification[];
	}
}
