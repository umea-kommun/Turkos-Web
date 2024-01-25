import { FormMode } from '@/models/Enums';

/**
 * Returns a class name from current field mode
 * @param mode field mode
 */
export const fieldModeClass = (mode: FormMode | string): string => {
	return mode.toLowerCase() + '-mode';
};
