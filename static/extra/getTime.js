export function getCurrentDateInLocaleString() {
	const currentDate = new Date()
	const options = {
		weekday: 'short',
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZone: 'GMT',
		hour12: false
	}
	const [weekday, month, date, year, time] = currentDate
		.toLocaleString('en-US', options)
		.replace(/,/g, '')
		.split(' ')
	const rearrangedDate = `${weekday}, ${date} ${month} ${year} ${time} GMT`

	return rearrangedDate
}
