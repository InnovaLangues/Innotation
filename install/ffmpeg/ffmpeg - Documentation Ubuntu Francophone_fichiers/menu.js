function menu()
{
  document.getElementById('hidemenu').onmouseup=thisMenu;
}

function thisMenu(e){ switchMenuVisible( this ); }

function switchMenuVisible() {
	if (menu_hidden) {
    menu_hidden=0;
    document.documentElement.className = '';
    setCookie('menuAffiche', 'visible');
  }
  else {
    menu_hidden=1;
    document.documentElement.className = 'hidemenu';
    setCookie('menuAffiche', 'hidden');
  }
}

window.onload=function(){
  menu();
  inputLook();
  if(getCookie('menuAffiche')=='hidden'){
    switchMenuVisible();
  }
}