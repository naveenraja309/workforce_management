import axios from "axios"
import { useState, useCallback, useRef, useEffect } from "react"
import { environment } from "../../Environment/Environment"
import axiosRetry from 'axios-retry';


const apiURL = environment.apiUrl

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const activeHttpRequests = useRef([])


  const sendRequest = useCallback(
    async (url, method = "GET", data = null, headers = {}) => {
      setIsLoading(true)
      const httpAbortCtrl = new AbortController()
      activeHttpRequests.current.push(httpAbortCtrl)
      try {
        const options = {
          method,
          url: apiURL + url,
          data,
          headers
          // signal: httpAbortCtrl.signal
        }
        axiosRetry(axios, {
          retries: 1, // number of retries
          retryDelay: (retryCount) => {
            console.log(`retry attempt: ${retryCount}`);
            return retryCount * 2000; // time interval between retries
          },
          retryCondition: (error) => {
            console.clear()
            // if retry condition is not specified, by default idempotent requests are retried
            return error
          },
        });
        const response = await axios(options)
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        )
        setIsLoading(false)
        return response.data
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
        throw err
      }
    },
    []
  )
  const clearError = () => {
    setError(null)
  }
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
    }
  }, [])
  return { isLoading, error, sendRequest, clearError }
}
