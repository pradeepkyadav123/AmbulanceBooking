import axios from 'axios';
export default class Api {
  // private authorisationToken = Application.sharedApplication().user!.authenticationToken;

  async  getresponse(value){

    var response=await fetch(UrlService.CONSTURI + 'index.php/' + UrlService.APIVERSION3 + value,{
      method:"GET",
  }
       ).then((response) => response.json())
       .then((responseJson) => {
        // var result=await response.json()
        return responseJson;
       }).catch(error=>{
        return error;
       })
    //    var result=await response.json()
    return response

        
    }       


    async  postresponse(value,url){
        console.log('post value ashish',value)
        var data = {"country_id": "1", "customer_id": "2", "drop_address": "84, Block A, Sector 64, Noida, Uttar Pradesh 201307, India", "drop_lat": 28.611891635931933, "drop_lng": 77.37622601911426, "filter": 0, "km": "1.4 ", "package_id": 0, "payment_method": 1, "pickup_address": "Unnamed Road, A Block, Sector 63, Noida, Uttar Pradesh 201307, India", "pickup_date": "11-01-2022 22:54:16", "pickup_lat": 28.620967603172332, "pickup_lng": 77.38117000088096, "promo": 0, "trip_type": 3, "vehicle_type": 1}
   console.log('matching data ',data)
        var response=    await axios({
            method: 'post', 
            url: url,
            data:value //{"country_id": "1", "customer_id": "2", "drop_address": "84, Block A, Sector 64, Noida, Uttar Pradesh 201307, India", "drop_lat": 28.611891635931933, "drop_lng": 77.37622601911426, "filter": 0, "km": "1.4 ", "package_id": 0, "payment_method": 1, "pickup_address": "Unnamed Road, A Block, Sector 63, Noida, Uttar Pradesh 201307, India", "pickup_date": "11-01-2022 22:54:16", "pickup_lat": 28.620967603172332, "pickup_lng": 77.38117000088096, "promo": 0, "trip_type": 3, "vehicle_type": 1}
          })
          .then(async response => {
            console.log('post response ashish',response)
            return response;
         })
          .catch(error => {
            console.log('post error ashish',error)
              return error;
          });
    
    // console.log('Headers in pool', JSON.stringify(headers));

    //   var response=await fetch(UrlService.CONSTURI + 'index.php/' + UrlService.APIVERSION3 + value,{
    //     method:"POST",
    //       body: formData,
    //     }).then((response) => response.json())
    //      .then((responseJson) => {
    //       // var result=await response.json()
    //       // console.log('post resonse : ',JSON.stringify(responseJson))
    //       return responseJson;
    //      }).catch(error=>{
    //       console.log('post resonse : ',error)
    //       return error;
    //      })
       
      return response
   
     }       
  
   



    

 

}