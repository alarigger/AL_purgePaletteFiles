


function AL_PurgePalettesFiles(){

			// VARIABLES 

	var projectpath = scene.currentProjectPath()
	var scene_palettes_names = Array();
	var paletteList = PaletteObjectManager.getScenePaletteList();
	var scene_palettes_files = Array();
	var files_to_delete = Array();
	var palette_directory = "palette-library";
	
	var logfile = "AL_palette_log.txt";
	var repport = "palette deletion log";
	
	var deletedPaletteDir = projectpath+"/"+"palette_to_delete/";
	


	//EXECUTION 
	
	
	
	scene_palettes_files = read_palette_files();
	scene_palettes_names = read_scene_palettes();
	files_to_delete = get_unsued_palette_files();
	
	MessageLog.trace( "files_to_delete : ");
	MessageLog.trace( files_to_delete);
	
	delete_files()
	updateLog();
	
	
	
	

	// FUNCTIONS 


	
	function read_palette_files(){
		
		var dir = new Dir;
		var dirpath =  projectpath+"/"+palette_directory;
		dir.path =dirpath;
		
		MessageLog.trace(dir.entryList("*.plt",-1,-1));
		return dir.entryList("*.plt",-1,-1);

	}
	
	function read_scene_palettes(){
		
		var palettes_names = Array();
		
		for( var idx = 0; idx < paletteList.numPalettes; idx++ )
			{
				var palId = PaletteManager.getPaletteId( idx );	
				var palette = PaletteObjectManager.getPalette( palId );

				palettes_names.push(palette.getName());

			}	
			
		MessageLog.trace(palettes_names);
			
		return palettes_names;

	}
	
	function get_unsued_palette_files(){
		
		var unmatched_files = Array();
		
		for (var f = 0 ; f<scene_palettes_files.length;f++){
			
			var palette_file_name = scene_palettes_files[f].split('.')[0];
			var match = 0;
			
			for (var p = 0 ; p<scene_palettes_names.length;p++){
					MessageLog.trace(scene_palettes_names[p]);
					if(scene_palettes_names[p]==palette_file_name){
						match++
					}
			}
			
			if(match == 0){
				MessageLog.trace(palette_file_name + "IS UNUSED")
				unmatched_files.push(scene_palettes_files[f]);
			}
			
		}
		
		return unmatched_files;
		
	}
	

	function updateLog(){
		
		var filename = "palettelog.txt";
		
		
		MessageLog.trace(projectpath);

		var filePath = projectpath+"/"+filename;	
		file = new PermanentFile(filePath);

		var content = file.read()
		file.open();                 // open with write only stream
		file.writeLine( content+"new log" );           // write line to file
		file.close();  
		


									
	}

	function delete_files(){
		
		
		
		/*var dir = new Dir;
		var del_Dir= dir.mkdir(projectpath+"/"+deletedPaletteDir);*/
		
		/*if(
		
		var moveTo = deletedPaletteDir;
		
		*/
		
		
		
		
		MessageLog.trace( "delete_files");
		
		for(var d = 0; d < files_to_delete.length ; d++){
		
			var filePath = projectpath+"/"+palette_directory+"/"+files_to_delete[d];
			MessageLog.trace("about to delete");
			MessageLog.trace( filePath);
			file = new PermanentFile(filePath);
			file.remove();	
			//file.move(moveTo);
			
			

			var filePath = projectpath+"/"+palette_directory+"/"+files_to_delete[d]+"~";
			MessageLog.trace("about to delete");
			MessageLog.trace( filePath);
			file = new PermanentFile(filePath);
			file.remove();
			//file.move(moveTo);			
			
			
		}

	}

	
}
