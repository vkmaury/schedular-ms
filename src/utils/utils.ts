import moment from 'moment'

export function generate_random_number(length: number) {
	let result = ''
	const characters = '0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

export const isValidDate = (dateString: string) => {
	return moment(dateString, 'YYYY-MM-DD', true).isValid()
}
// Validate email using regex
export const isValidEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}