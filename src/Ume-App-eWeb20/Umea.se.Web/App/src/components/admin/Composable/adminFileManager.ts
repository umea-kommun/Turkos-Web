/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { MutationType } from '@/models/Enums';
import { IForm, IRootState } from '@/models/IForm';
import Config from '@/utils/Config';
import { Helper } from '@/utils/helper';
import { Store } from 'vuex';

const blobCache: {
	[key: string]: { file: Blob; stepId?: string; fieldId?: string };
} = {};

export const useAdminFileManager = () => {
	// Add file to blob cache
	const addFile = async (
		file: File,
		stepId: string,
		fieldId: string
	): Promise<string> => {
		const blobUri: string = await new Promise((resolve) => {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				if (typeof reader.result === 'string') {
					const blobUri = URL.createObjectURL(file);
					blobCache[blobUri] = {
						file: file,
						stepId,
						fieldId,
					};
					resolve(blobUri);
				}
			});
			reader.readAsDataURL(file);
		});
		return blobUri;
	};

	// Get files from blob cache
	const getFiles = () => {
		return blobCache;
	};

	// Remove file from blob cache
	const remove = (blobUri: string) => {
		if (blobUri in blobCache) {
			delete blobCache[blobUri];
		}
	};

	const blobUriExistsInForm = (blobUri: string, form: IForm) => {
		const formJson = JSON.stringify(form);
		return formJson.includes(blobUri);
	};

	// Upload all used files in the blob cache
	const uploadFiles = async (store: Store<IRootState>) => {
		const filesToUpload = getFiles();
		if (Object.keys(filesToUpload).length && store.state.form) {
			for (const blobUri in filesToUpload) {
				// Make sure the file is still used before we upload it
				if (blobUriExistsInForm(blobUri, store.state.form)) {
					const fileData = filesToUpload[blobUri];
					// Save the file and replace blob uris with actual url
					await store.dispatch('adminUploadFile', {
						blobUri,
						file: fileData.file,
						formId: store.state.form?.id,
						stepId: fileData.stepId,
						fieldId: fileData.fieldId,
					});
				}

				// Remove file from the cache after upload or if it is not used
				remove(blobUri);
			}
		}
	};

	const getUsedUploadedFiles = async (form: IForm): Promise<string[]> => {
		const formJson = JSON.stringify(form);
		const re = new RegExp(
			Helper.escapeRegExp(Config.VUE_APP_FILE_GET_PATH_URL) +
				'[\\w\\-\\.]+',
			'g'
		);
		const matches = formJson.match(re);
		if (matches?.length) {
			return matches;
		}
		return [];
	};

	// Store which files are used when the form was opened or we saved last time
	const updateUsedUploadedFiles = async (store: Store<IRootState>) => {
		if (store.state.form) {
			const usedFiles = await getUsedUploadedFiles(store.state.form);
			store.commit(MutationType.UpdateAdminState, {
				prop: 'usedFiles',
				value: usedFiles,
			});
		}
	};

	// Remove the files that are no longer used in the form
	const removeUnusedUploadedFiles = async (store: Store<IRootState>) => {
		if (store.state.form) {
			const originalFiles = store.state.admin?.usedFiles ?? [];
			const newFiles = await getUsedUploadedFiles(store.state.form);

			const filesToRemove = originalFiles
				.filter((imageUrl) => {
					return !newFiles.includes(imageUrl);
				})
				.map((fullFilePath) =>
					fullFilePath.replace(Config.VUE_APP_FILE_GET_PATH_URL, '')
				);
			if (filesToRemove.length) {
				for (const reference of filesToRemove) {
					await store.dispatch('adminRemoveFile', {
						reference,
					});
				}
			}
		}
	};

	return {
		addFile,
		getFiles,
		remove,
		uploadFiles,
		updateUsedUploadedFiles,
		removeUnusedUploadedFiles,
	};
};
