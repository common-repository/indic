function BrowseFile(url)
{
	var frame;
	if(document.all)
	{
		frame= window.frames['buffer'];
	}
	else
	{
		frame = document.getElementById('buffer');
		url = 'file:\/\/\/'+url;
	}
	
	var html = '';
	html += '<HTML><BODY ONLOAD="top.document.all[\'bufferdiv\'].innerHTML = window.buffer.document.body.innerHTML;">';
	html += '<IFRAME NAME="buffer" SRC="' + url + '"></IFRAME>';
	html += '<\/BODY><\/HTML>';

	if(document.all)
	{
		frame.document.open();
		frame.document.write(html);
		frame.document.close();
	}
	else
	{
		try
		{
			  var doc = frame.contentWindow.document;
			  doc.open();
			  doc.write(html);
			  doc.close();
		}
		catch (e)
		{
			alert(e);
		}
	}
}



// this funcrion loads contents from div tag to rich text editbox


function LoadPage(DivID, IFrameID)
{
document.getElementById(IFrameID).contentWindow.document.body.innerHTML=document.getElementById(DivID).innerHTML;
}

//clear the editor pane

function ClearPage(IFrameID)
{
document.getElementById(IFrameID).contentWindow.document.body.innerHTML='';
}


// this funcrion saves contents of div tag to iframe

function savePage(filename,charset,extension,GivId)
{

	var w = window.frames.w;
	if( !w )
	{
		w = document.createElement( 'iframe' );
		w.id = 'w';
		w.style.display = 'none';
		if(document.all)
			document.body.insertBefore( w );
		else
			document.body.insertAdjacentElement('beforeEnd', w);
		w = window.frames.w;
		if( !w )
		{
			w = window.open( '', '_temp', 'width=500,height=500' );
			if( !w )
			{
				window.alert( 'Sorry, could not create file.' ); return false;
			}
		}
	}
  
 	var d = w.document;
	d.open( 'text/plain', 'replace' );
	d.charset = charset;
 
	if( extension == '.html' || extension == '.doc')
	{
		d.close();
		d.body.innerHTML = '\r\n' + document.getElementById(GivId).contentWindow.document.body.innerHTML + '\r\n';
	}
	else
	{  //  '.txt'
		d.write( document.getElementById(GivId).contentWindow.document.body.innerText );
		d.close();
	}

	if(!document.all)
		alert('Oops! This feature is not available outside Internet Explorer! Please copy the context from new window and save to file...');

	var rval = d.execCommand( 'SaveAs', null, filename );
	if(rval)
	{
		window.alert( 'File has been saved.' );
 	}
	else
	{
	  window.alert( 'The file has not been saved.' );
 	}
	w.close();
}
