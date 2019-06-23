import model3 from '../../assets/img/model3.png'
import models from '../../assets/img/models.png'
import modely from '../../assets/img/modely.png'
import modelx from '../../assets/img/modelx.png'

export default (model) =>{
    let img;
    if(!model){
      img = model3
      return img
    }
    model = model.toLowerCase()
    switch (true) {
      case (model === 'model 3'):
        img = model3
        break
      case (model === 'model s'):
        img = models
        break
      case (model === 'model y'):
        img = modely
        break
      case (model === 'model x'):
        img = modelx
        break
      default:
        img = model3
    }
    return img
  }
