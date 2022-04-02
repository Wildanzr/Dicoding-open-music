const successResponse = (message, data) => {
  if (!message) return { status: 'success', data: data }

  if (!data) return { status: 'success', message: message }

  return { status: 'success', message: message, data: data }
}

const failResponse = (status, message) => {
  return { status: status, message: message }
}

module.exports = { successResponse, failResponse }
