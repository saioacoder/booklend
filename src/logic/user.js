import { signup, login, logout, registerAuthObserver } from '../services/auth';
import { addObjectWithId, getObjectById, getObjectsByConditions } from '../services/data';


//
export async function userSignup(nameUser, lastname, email, password, address, postalCode, city, province, idLibrary) {
	const { success, error, id } = await signup(email, password);
	const warningNum = 0;
	const isAdmin = false;
	if(success) {
		await addObjectWithId('users', id, { nameUser, lastname, email, address, postalCode, city, province, warningNum, idLibrary, isAdmin });
		const user = await getObjectById('users', id);
		return { success: true, id, user };
	}
	return { success: false, error };
}


//
export async function adminSignup(nameUser, lastname, email, password, idLibrary) {
	const { success, error, id } = await signup(email, password);
	const isAdmin = true;
	if(success) {
		await addObjectWithId('users', id, { nameUser, lastname, email, idLibrary, isAdmin });
		const user = await getObjectById('users', id);
		return { success: true, id, user };
	}
	return { success: false, error };
}


//
export async function userLogin(email, password) {
	const { success, error, id } = await login(email, password);
	if(success) {
		const user = await getObjectById('users', id);
		return { success: true, id, user };
	}
	return { success: false, error };
}


//
export function registerAuthStateChangeHandler(callback) {
	registerAuthObserver(callback);
}


//
export async function getUserById(id) {
	const user = await getObjectById('users', id);
	return { ...user, idUser: user.id };
}


//
export async function getUserByEmail(email) {
	const { result, error } = await getObjectsByConditions('users', [
		{
			field: 'email',
			condition: '==',
			value: email
		}
	]);
	if(result !== null && !error) {
		return { ...result[0], idUser: result[0].id };
	} else {
		return null;
	}
}


//
export function userLogout() {
	logout();
}