// Alexandre Cormier 16_11_2020


function AL_PurgePalettesFiles(){

	// VARIABLES 

	var projectpath = scene.currentProjectPath()
	var scene_palettes_names = Array();
	var paletteList = PaletteObjectManager.getScenePaletteList();
	var scene_palettes_files = Array();
	var files_to_delete = Array();
	var palette_directory = "palette-library";
	
	
	var today =new Date().toLocaleDateString()
	
	var logfile = "AL_palette_log.txt";
	var log = "LOG >>>> "+Date()+"\n";
	var repport ="";
	
	var postrepport = "";
	
	var deletedPaletteDir = projectpath+"/"+"palette_to_delete/";
	
	var deletioncount = 0;
	


	//EXECUTION 
	updateLog();

	MessageLog.trace(scene.currentProjectPathRemapped())
		
	scene_palettes_files = read_palette_files();
	scene_palettes_names = read_scene_palettes();
	files_to_delete = get_unsued_palette_files();
	
	
	MessageLog.trace("files_to_delete : ");
	MessageLog.trace(files_to_delete);
	
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

            var rc = d.exec();

            if (rc) {
				
				if(files_to_delete.length>0){
					
					reupload_ghost_palettes_and_remove_them();
					
					check_deletion();

					MessageBox.information(postrepport);
					
					MessageLog.trace(repport+postrepport);
					
					updateLog();
				
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
			
			
			MessageLog.trace("removePaletteReferencesAndDeleteOnDisk");
			if(PaletteObjectManager.removePaletteReferencesAndDeleteOnDisk(reimported_palette.id)){
				MessageLog.trace(files_to_delete[f]+" ---- deletion asked")
				log+=files_to_delete[f]+" --?-- deletion asked"+"\n";
				postrepport+=files_to_delete[f]+" --?-- deletion asked"+"\n";
			}else{
				log+=" ! error ! "+files_to_delete[f]+"\n";
				postrepport+=" ! error ! "+files_to_delete[f]+"\n";
			}
				
				
	
			scene.saveAll();
		
		}
		
	}
	
	
	function check_deletion(){
		
		new_scene_palettes_files = read_palette_files();
		
		for(f in files_to_delete){
			
			if(new_scene_palettes_files.indexOf(files_to_delete[f])==-1){
				log+=files_to_delete[f]+" --V- was deleted"+"\n";
				postrepport+=files_to_delete[f]+" --V- was deleted"+"\n";	
				
			}else{
				log+=files_to_delete[f]+" --X- unable to delete"+"\n";		
				postrepport+=files_to_delete[f]+" --X- unable to delete"+"\n";			
				
			}
			
			
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
		
		var filename = "palette_deletion_log.txt";

		var filePath = scene.currentProjectPathRemapped()+"/"+filename;	
		logfile = new PermanentFile(filePath);

		logfile.open(4);                 // open with write only stream
		var content = logfile.read();
		MessageLog.trace("file content");
		MessageLog.trace(logfile.read());
		MessageLog.trace(filePath);
		logfile.writeLine(content+log);           // write line to file
		logfile.close();  
	
	}
	
	
	
}

