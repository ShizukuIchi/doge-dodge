let menuVisibility = false
const menu = document.querySelector('#menu')

document.querySelector('#settings').onclick = () => {
  menu.classList.toggle('menu-active')
}

menu.onclick = e => {
  if(e.target === menu){
    menu.classList.toggle('menu-active')
  }
}