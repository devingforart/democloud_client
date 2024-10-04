import os

# Lista de directorios
directories = [
  'C:/Users/southAToms/Desktop/develop/SAS_ORGANA/Organa/src/components/Calendar.tsx',
  #'C:/Users/southAToms/Desktop/develop/SAS_ORGANA/Organa/src-tauri/src'
]

# Lista de archivos individuales
individual_files = [
  #'C:/Users/southAToms/Desktop/develop/SAS_ORGANA/Organa/src-tauri/src/main.rs',
  'C:/Users/southAToms/Desktop/develop/SAS_ORGANA/Organa/src-tauri/src/calendar.rs'

]

# Define las extensiones de archivos que te interesan
file_extensions = ['.tsx', '.rs', '.ts']

# Archivo de salida donde se copiará todo el código
output_file = 'combined_code.txt'

def is_code_file(file):
    return any(file.endswith(ext) for ext in file_extensions)

def combine_file(file_path, outfile):
    with open(file_path, 'r', encoding='utf-8') as infile:
        content = infile.read()
        outfile.write(f'{file_path}\n\n')
        outfile.write(f'Contenido:\n{content}\n\n{"-"*80}\n\n')

def search_and_combine_files(directories, individual_files, output_file):
    with open(output_file, 'w') as outfile:
        # Combinar archivos desde directorios
        for directory in directories:
            for root, dirs, files in os.walk(directory):
                for file in files:
                    if is_code_file(file):
                        file_path = os.path.join(root, file)
                        combine_file(file_path, outfile)
        
        # Combinar archivos individuales
        for file in individual_files:
            if is_code_file(file):
                combine_file(file, outfile)

# Ejecutar la función
search_and_combine_files(directories, individual_files, output_file)
print(f'Todos los archivos de código se han copiado en {output_file}')
