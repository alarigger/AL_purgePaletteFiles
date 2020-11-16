/*

AL_PurgePalettesFiles

delete unused palettes stored inside the scene directory. 
create a log file : "palette_deletion_log.txt" at the root od the scene directory. 

options : 
delete ALL pencil texture palettes 
delete ALL texture directories


16_11_2020

Author :  Alexandre Cormier 
repository : https://github.com/alarigger/AL_purgePaletteFiles
website : www.alarigger.com
version : 1.2
Licence : GNU GPL licence v2.0

*/

// ***************************************  P U R G E _ P A L E T T E S _ F I L E S ************************** //

function AL_PurgePalettesFiles(){

	// VARIABLES 

	var projectpath = scene.currentProjectPath()
	var scene_palettes_names = Array();
	var paletteList = PaletteObjectManager.getScenePaletteList();
	var scene_palettes_files = Array();
	var files_to_delete = Array();
	var texturefiles_to_delete = Array();
	var dir_to_delete = Array();
	var palette_directory = "palette-library";
	
	var texturePalettes_to_delete = Array();
	
	
	var cleanTexturePalettes = false;
	
	
	var today =new Date().toLocaleDateString()
	
	var logfileName = "AL_palette_log.txt";
	var log = "\n\n ******** NEW LOG >>>> "+Date()+"\n\n\n";
	var repport ="";
	
	var postrepport = "";
	
	var deletedPaletteDir = projectpath+"/"+"palette_to_delete/";
	
	var deletioncount = 0;
	


	//EXECUTION 
	
	scene.beginUndoRedoAccum("AL_PurgePalettesFiles");
    

	MessageLog.trace(scene.currentProjectPathRemapped())
		
	scene_palettes_files = read_palette_files();
	scene_palettes_names = read_scene_palettes();
	files_to_delete = get_unsued_palette_files();
	texturePalettes_to_delete = read_scene_TexturePalettes();
	dir_to_delete = read_texture_dir()
	
	
	MessageLog.trace("files_to_delete : ");
	MessageLog.trace(files_to_delete);
	

	
	Confirmdialog()
	
	
	scene.endUndoRedoAccum();
	
	/////////////////////////////////////////////// FUNCTIONS 


		
	// INPUT DIALOG : 
	
	function Confirmdialog() {

		var d = new Dialog

            d.title = "AL_PurgePalettesFiles";
			
			if(files_to_delete.length>0 || texturePalettes_to_delete.length>0){

				repport += " ! The following files are about to be deleted ! : "+"\n"

				repport += "\n" + "UNUSED COLOR PALETTES : "+"\n";

				for (var c = 0; c < files_to_delete.length; c++) {

					var files = files_to_delete[c];

					repport += "\n" + files;

				}
				
				repport += "\n\n" + "TEXTURE PALETTES : "+"\n";

				for (var t = 0; t < texturePalettes_to_delete.length; t++) {

					var tfiles = texturePalettes_to_delete[t].getName()+'.plt';

					repport += "\n" + tfiles;

				}		

				
			}else{
				
				repport = "no files to delete";
				
			}

			
			var bodyText = new Label();
			bodyText.text =repport;
			d.add( bodyText );
			
			var TexutreCB = new CheckBox();
            TexutreCB.text = "delete all texture palettes : "
            TexutreCB.checked = false;
			d.add( TexutreCB);
			
			var TexDirCB = new CheckBox();
            TexDirCB.text = "delete all texture directories : "
            TexDirCB.checked = false;
			d.add( TexDirCB);

            MessageLog.trace(repport);

            var rc = d.exec();

            if (rc) {
				
				if(files_to_delete.length>0 || texturePalettes_to_delete.length>0){
					
					if(files_to_delete.length>0){
						
						reupload_ghost_palettes_and_remove_them();
						
					}
					
					if(TexDirCB.checked){
						
						delete_texture_dir();
					}
					
					if(TexutreCB.checked){
						
						delete_texture_palettes();
						
					}
					
					check_deletion();

					MessageBox.information(postrepport);
					
					MessageLog.trace(repport+postrepport);
					
					updateLog();
				
				}



            }


	}
	
	
	

	// READ DATAS
	
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

				if(palette.isColorPalette()){
					palettes_names.push(palette.getName());
				}


			}	
			
		MessageLog.trace("scene palette");
		MessageLog.trace(palettes_names);
		
		return palettes_names;

	}
	
	function read_scene_TexturePalettes(){
		
		var texture_palettes = Array();
		
		for( var idx = 0; idx < paletteList.numPalettes; idx++ )
			{
				var palId = PaletteManager.getPaletteId( idx );	
				var palette = PaletteObjectManager.getPalette( palId );
				
				if(palette.isTexturePalette()){
					texture_palettes.push(palette);
				}
				
				

			}	
			
		MessageLog.trace("scene Texturepalette");
		MessageLog.trace(texturePalettes_to_delete);
			
		return texture_palettes
		
	}
	
	function read_texture_dir(){
		
		var dir_list = Array();
		
		var dir = new Dir;

		for (var t = 0 ; t<texturePalettes_to_delete.length;t++){
			
			var texture_palette = texturePalettes_to_delete[t]
			
			var dir_path = get_palette_library_path()+"\\"+texture_palette.getName()+"_textures";
			
			var dir = new Dir;
			dir.path =dir_path;
			
			MessageLog.trace(dir_path);
			
			if(dir.exists){
				
				dir_list.push(dir_path);
				
			}
		}
		
		return dir_list;
		
		
		
		
	}
	
	function check_deletion(){
		
		new_scene_palettes_files = read_palette_files();
		
		for(f in files_to_delete){
			
			if(new_scene_palettes_files.indexOf(files_to_delete[f])==-1){
				log+="\n"+" --V- was deleted : "+files_to_delete[f];
				postrepport+="\n"+" --V- was deleted : "+files_to_delete[f];	
				
			}else{
				log+=files_to_delete[f]+" --X- unable to delete"+"\n";		
				postrepport+=files_to_delete[f]+" --X- unable to delete"+"\n";			
				
			}
			
			
		}

	}

	
	

	// TREAT DATAS


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
	
	////// D E L E T E   F U N C T I O N S
	
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
	
	
	// !! this function manipulate palette objects instead of palette names
	
	function delete_texture_palettes(){
		
		MessageLog.trace("delete_texture_palettes");
		
		for (var t = 0 ; t<texturePalettes_to_delete.length;t++){
	
			
			var texture_palette = texturePalettes_to_delete[t]
			
			MessageLog.trace(texture_palette)
			
			// for deletion check 
			var texturepalettefile = texture_palette.getName()+".plt";
			files_to_delete.push(texturepalettefile);
			
			
			if(PaletteObjectManager.removePaletteReferencesAndDeleteOnDisk(texture_palette.id)){
				
				MessageLog.trace(texture_palette.getName()+" ---- deletion asked")
				log+="\n"+" --?-- deletion asked : "+texture_palette.getName()
				postrepport+="\n"+" --?-- deletion asked : "+texture_palette.getName()
				
			}else{
				
				log+=" ! error ! "+texture_palette+"\n";
				postrepport+=" ! error ! "+texture_palette+"\n";
				
			}
		
		}		
		
		scene.saveAll();
		
		
	}
	
	function delete_texture_dir(){
		
		for (var d = 0 ; d<dir_to_delete.length;d++){
	
			var current_dir_path = dir_to_delete[d];
			
			MessageLog.trace(current_dir_path);
			
			files_to_delete.push(current_dir_path);
			
			var currentDir = new Dir;
			currentDir.path =current_dir_path;
			
			if(currentDir.rmdirs(current_dir_path)){
				
				MessageLog.trace(" --?-- directory deletion asked : "+current_dir_path)
				log+="\n"+" --?-- directory deletion asked : "+current_dir_path
				postrepport+="\n"+" --?--directory deletion asked : "+current_dir_path
				
			}else{
				
				log+=" ! failed to remove directory  ! "+current_dir_path+"\n";
				postrepport+=" ! failed to remove directory ! "+current_dir_path+"\n";
				
			}
		
		}		
		
		scene.saveAll();
		
	}		
	// keep logs of file deletions in a txt

	function updateLog(){
		
		var filename = "AL_palette_deletion_log.txt";

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

