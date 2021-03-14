import axios from 'axios';
import { key, proxy } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
    
  }
  async getRecipe(query) {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const key = "aad5e11a6ee4469087db155bdac74def";
    const siteAPI = `https://api.spoonacular.com/recipes/complexSearch?query=${query}`;
    try {
      const res = await axios(`${proxy}${siteAPI}?key=${key}&q=${query}`); //Return a json object
      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}
