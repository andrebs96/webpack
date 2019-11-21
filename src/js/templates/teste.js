import cow from '../components/cow'
import '../../scss/main.scss'
import icon from '../../img/icon.png'

const message = 'is great'
  
document.querySelector('#box').innerText = cow.say(`Webpack with Babel and SASS ${message}!`)

document.querySelector('#icon').innerHTML = `<img src="${icon}" />`