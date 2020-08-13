var Table = require('cli-table');
const db = require('./db_config');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let mhs = new Mahasiswa();

//RUN PROGRAM
login();

class Mahasiswa {
    constructor() {
        
    }
    
    //MENU MAHASISWA
    menuMahasiswa() {
        
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Mahasiswa`);
        console.log(`[2]. Cari Mahasiswa`);
        console.log(`[3]. Tambah Mahasiswa`);
        console.log(`[4]. Hapus Mahasiswa`);
        console.log(`[5]. Kembali`);
        cetakGaris();
        rl.question('Masukkan salah satu No. dari opsi diatas: ', (pilMhs) => {
            switch (pilMhs) {
                case '1':
                    cetakGaris();
                    mhs.daftar();
                    menuMahasiswa();
                    break;
                case '2':
                    cetakGaris();
                    mhs.cari();
                    break;
                case '3':
                    cetakGaris();
                    mhs.tambah();
                    break;
                case '4':
                    cetakGaris();
                    mhs.hapus();
                    break;
                case '5':
                    menuUtama();
                    break;
                default:
                    console.log('Pilihan tidak sesuai, silakan coba kembali!');
                    menuMahasiswa();
                    break;
            }
        });
    }

    daftar() {
        db.serialize(() => {
            let sqlMhs = "SELECT * FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan=jurusan.id";
            db.all(sqlMhs, (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    var table = new Table({
                        head: ['NIM', 'Nama', 'Alamat', 'Umur', 'Jurusan'],
                        colWidths: [7, 15, 20, 7, 20]
                    });
                    rows.forEach((row) => {
                        table.push([row.nim, row.nama, row.alamat, row.umur, row.namajurusan]);
                    });
                    console.log(table.toString());
                };
            })
        });
    }

    cari() {
        rl.question('Masukan NIM Mahasiswa yang anda cari : ', (nim) => {
            cetakGaris();
            let sqlMhs = "SELECT * FROM Mahasiswa JOIN jurusan ON mahasiswa.jurusan=jurusan.id WHERE nim = ?";
            db.get(sqlMhs, [nim], (err, row) => {
                if (err) {
                    throw err;
                } if (row) {
                    console.log('STUDENT DETAILS');
                    cetakGaris();
                    console.log(`NIM     : ${row.nim}`);
                    console.log(`Nama    : ${row.nama}`);
                    console.log(`Alamat  : ${row.alamat}`);
                    console.log(`Umur    : ${row.umur}`);
                    console.log(`Jurusan : ${row.namajurusan}`);
                } else {
                    console.log(`Mahasiswa dengan NIM ${nim}] tidak terdaftar`);
                }
                cetakGaris();
                rl.close();
            });
        });
    }

    tambah() {
        console.log('Lengkapi data dibawah ini:');
        rl.question('NIM :', (nim) => {
            rl.question('Nama :', (nama) => {
                rl.question('Alamat :', (alamat) => {
                    rl.question('Umur :', (umur) => {
                        rl.question('Jurusan :', (namajurusan) => {
                            db.serialize(() => {
                                let sqlMhs = `INSERT INTO mahasiswa (nim, nama, alamat, umur, jurusan) VALUES 
                                ("${nim}", "${nama}", "${alamat}", ${umur}, "${namajurusan}")`;
                                db.run(sqlMhs, (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                    mhs.daftar();
                                });
                            });
                        });
                    });
                });
            });
        });
        return db;
    }

    hapus() {
        rl.question('Masukkan NIM Mahasiswa yang akan dihapus: ', (nim) => {
            db.run(`DELETE FROM mahasiswa WHERE nim = '${nim}'`, (err) => {
                if (err) {
                    throw err; // Belum jalan fungsinya
                } else {
                    console.log(`Mahasiswa dengan NIM ${nim} telah dihapus`);
                    cetakGaris();
                    mhs.daftar();
                }
            });
            rl.close();
        })
    }
}

function login() {
    cetakGaris();
    console.log(`Welcome to Universitas Pendidikan Indonesia`);
    console.log('Jl. Setiabudhi No. 255');
    cetakGaris();

    rl.question('Username: ', (answer1) => {
        cetakGaris();
        rl.question('Password: ', (answer2) => {
            cetakGaris();

            db.serialize(function () {
                let sqlLogin = "SELECT * FROM login WHERE user=? AND password=?";
                let jawabUser = answer1.trim().toLowerCase();
                let jawabPass = answer2.trim().toLowerCase();

                db.get(sqlLogin, [jawabUser, jawabPass], (err, succ) => {
                    if (err) throw err;

                    if (succ) {
                        console.log(`Welcome ${answer1}. Your access level is : ADMIN`);
                        menuUtama();
                    } else {
                        console.log('Username/Password tidak sesuai, silakan coba kembali!');
                        rl.close();
                    }
                });
            });
        })
    });
}

//MENU UTAMA
function menuUtama() {

    cetakGaris();
    console.log('Silakan pilih opsi dibawah ini')
    console.log(`[1]. Mahasiswa`);
    console.log(`[2]. Jurusan`);
    console.log(`[3]. Dosen`);
    console.log(`[4]. Mata Kuliah`);
    console.log(`[5]. Kontrak`);
    console.log(`[6]. Exit`);
    cetakGaris();
    rl.question('Masukkan salah satu No. dari opsi diatas: ', (answer) => {
        switch (answer) {
            case '1':
                menuMahasiswa();
                break;
            case '2':
                menuJurusan();
                break;
            case '3':
                menuDosen();
                break;
            case '4':
                menuMatkul();
                break;
            case '5':
                menuKontrak();
                break;
            case '6':
                rl.close();
                break;
            default:
                console.log('Pilihan tidak sesuai, silakan coba kembali!');
                menuUtama();
                break;
        }
    });


    //MENU JURUSAN
    function menuJurusan() {
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Jurusan`);
        console.log(`[2]. Cari Jurusan`);
        console.log(`[3]. Tambah Jurusan`);
        console.log(`[4]. Hapus Jurusan`);
        console.log(`[5]. Kembali`);
        cetakGaris();
    }

    //MENU DOSEN
    function menuDosen() {
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Dosen`);
        console.log(`[2]. Cari Dosen`);
        console.log(`[3]. Tambah Dosen`);
        console.log(`[4]. Hapus Dosen`);
        console.log(`[5]. Kembali`);
        cetakGaris();
    }

    //MENU MATA KULIAH
    function menuMatkul() {
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Mata Kuliah`);
        console.log(`[2]. Cari Mata Kuliah`);
        console.log(`[3]. Tambah Mata Kuliah`);
        console.log(`[4]. Hapus Mata Kuliah`);
        console.log(`[5]. Kembali`);
        cetakGaris();
    }

    //MENU KONTRAK STUDI
    function menuKontrak() {
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Kontrak`);
        console.log(`[2]. Cari Kontrak`);
        console.log(`[3]. Tambah Kontrak`);
        console.log(`[4]. Hapus Kontrak`);
        console.log(`[5]. Kembali`);
        cetakGaris();
    }


}

function cetakGaris() {
    console.log(`===========================================`);
}

