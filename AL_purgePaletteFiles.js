


function AL_PurgePalettesFiles(){

			// VARIABLES 

	var projectpath = scene.currentProjectPath()
	var scene_palettes_names = Array();
	var paletteList = PaletteObjectManager.getScenePaletteList();
	var scene_palettes_files = Array();
	var files_to_delete = Array();
	var palette_directory = "palette-library";
	
	var logfile = "AL_palette_log.txt";
	var log = "log "+Date.now("d")+"\n";
	var repport ="";
	
	var postrepport = "";
	
	var deletedPaletteDir = projectpath+"/"+"palette_to_delete/";
	
	var deletioncount = 0;
	


	//EXECUTION 

	MessageLog.trace(scene.currentProjectPathRemapped())
	
	scene_palettes_files = read_palette_files();
	scene_palettes_names = read_scene_palettes();
	files_to_delete = get_unsued_palette_files();
	
	MessageLog.trace( "files_to_delete : ");
	MessageLog.trace( files_to_delete);
	
	Confirmdialog()
	
	
	
	

	// FUNCTIONS 
	
	
	function Confirmdialog() {

		var d = new Dialog

            d.title = "AL_PurgePalettesFiles";
			
			if(files_to_delete.length>0){

				repport += "The following files are about to be deleted : "


				for (var c = 0; c < files_to_delete.length; c++) {

					var files = files_to_delete[c];

					repport += "\n" + files;

				}				
			}else{
				
				repport = "no files to delete";
				
			}

			
			var bodyText = new Label();
			bodyText.text =repport;
			d.add( bodyText );

            MessageLog.trace(repport);

         //   MessageBox.information(repport)

            var rc = d.exec();

            if (rc) {
				
				if(files_to_delete.length>0){
					
					reupload_ghost_palettes_and_remove_them();
					
					//delete_files()
					
					MessageLog.trace(repport);
					
					updateLog();

					MessageBox.information(postrepport);
				
				}



            }


	}
	
	function reupload_ghost_palettes_and_remove_them(){
		
			var PL =PaletteObjectManager.getScenePaletteList()

		for (var f = 0 ; f<files_to_delete.length;f++){
	

			var palette_file_name = files_to_delete[f];
			var palette_path_file= get_palette_library_path()+"/"+palette_file_name;
			var palette_path =palette_path_file.split('.')[0];
			var reimported_palette = PL.addPalette(palette_path);
			
			MessageLog.trace(reimported_palette)
			MessageLog.trace(reimported_palette.id)
			MessageLog.trace(palette_file_name)
			
			//scene.saveAll();
			MessageLog.trace("removePaletteReferencesAndDeleteOnDisk");
			MessageLog.trace(PaletteObjectManager.removePaletteReferencesAndDeleteOnDisk(reimported_palette.id))
			

		
		}
		
		
		
		
		
	}
	
	function get_palette_library_path(){
		
		var slash = "\\";
	
		var finalpath =scene.currentProjectPathRemapped()+slash+palette_directory; 
		
		return  finalpath;
		
	}

	
	function read_palette_files(){
		
		var dir = new Dir;
		var dirpath =  get_palette_library_path();
		dir.path =dirpath;
		
		MessageLog.trace("palette files : ");
		MessageLog.trace(dir.path);
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
			
		MessageLog.trace("scene palette");
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
				//unmatched_files.push(scene_palettes_files[f]+"~");
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
		file.writeLine(content+log);           // write line to file
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
			
			if(file.remove()){
				log+=files_to_delete[d]+" ---- was deleted"+"\n";
				postrepport+=files_to_delete[d]+" ---- was deleted"+"\n";
				deletioncount ++;
			}else{
				log+=" ! unable to delete "+files_to_delete[d]+"\n";
				postrepport+=" ! unable to delete "+files_to_delete[d]+"\n";
			}
			
			
			

		}
		
		

	}

	
}

