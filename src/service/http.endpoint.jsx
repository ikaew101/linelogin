import axios from 'axios'

// const baseAPI = 'https://smartenergy-dev.truedigital.com/api/v1'
const baseAPI = 'https://smartenergy.truedigital.com/api/v1'
const header = () => ({
  Authorization: `Bearer ${localStorage.getItem('_auth')}`,
  ['X-API-KEY']: '9f50d8ea-ad34-4c30-a457-177f1b7158ff'
})

const get = async (url, filter = {}) => {
  const property = {
    method: 'GET',
    url: baseAPI + url,
    params: filter,
    headers: header(),
  }
  return axios(property)
    .then((response) => handleSuccess(response))
    .catch((error) => handleError(error))
}

const post = async (url, body) => {
  const property = {
    method: 'POST',
    url: baseAPI + url,
    headers: header(),
    data: body,
  }
  return axios(property)
    .then((response) => handleSuccess(response))
    .catch((error) => handleError(error))
}

const patch = async (url, body) => {
  const property = {
    method: 'PATCH',
    url: baseAPI + url,
    headers: header(),
    data: body,
  }
  return axios(property)
    .then((response) => handleSuccess(response))
    .catch((error) => handleError(error))
}

const put = async (url, body) => {
  const property = {
    method: 'PUT',
    url: baseAPI + url,
    headers: header(),
    data: body,
  }
  return axios(property)
    .then((response) => handleSuccess(response))
    .catch((error) => handleError(error))
}

const del = async (url, body) => {
  const property = {
    method: 'DELETE',
    url: baseAPI + url,
    headers: header(),
    data: body,
  }
  return axios(property)
    .then((response) => handleSuccess(response))
    .catch((error) => handleError(error))
}

function handleSuccess(result) {
  if (result.status !== 200 && result.status !== 201) {
    throw result
  }
  return result.data || result
}

function handleError(error) {
  throw (error.response && error.response.data) || error || 'System Error'
}

export const http = {
  get,
  post,
  patch,
  put,
  del,
}
