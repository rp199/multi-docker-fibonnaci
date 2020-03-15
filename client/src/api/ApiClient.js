import axios from "axios";

const VALUES_ENDPOINT = "/api/values";
const CURRENT_VALUES_ENDPOINT = `${VALUES_ENDPOINT}/current`;
const INDEXES_ENDPOINT = `${VALUES_ENDPOINT}/all`;
const SEQUENCE_GENERATOR_ENDPOINT = "/api/sequence/generate";

const apiClient = {
  fecthAllValues: async () => axios.get(CURRENT_VALUES_ENDPOINT),
  fecthValues: async indexes =>
    axios.get(CURRENT_VALUES_ENDPOINT, {
      params: {
        indexes: indexes
      }
    }),
  deleteValues: async () => axios.delete(CURRENT_VALUES_ENDPOINT),
  fetchIndexes: async () => axios.get(INDEXES_ENDPOINT),
  deleteIndexes: async () => axios.delete(INDEXES_ENDPOINT),
  submitIndex: async index =>
    axios.post(VALUES_ENDPOINT, {
      index: index
    }),
  generateSequence: async sequenceLength =>
    axios.post(SEQUENCE_GENERATOR_ENDPOINT, {
      sequenceLength: sequenceLength
    })
};

export default apiClient;
