var Table = require('cli-table');
const db = require('./db_config');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


class Mahasiswa {
    constructor() {

    }

    daftar(next) {
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
                next()
            })
        });
    }

    cari(next) {
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
                next();
            });
        });
    }

    tambah(next) {
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
                                    this.daftar(next)
                                });
                            });
                        });
                    });
                });
            });
        });
        return db;
    }

    hapus(next) {
        rl.question('Masukkan NIM Mahasiswa yang akan dihapus: ', (nim) => {
            db.run(`DELETE FROM mahasiswa WHERE nim = '${nim}'`, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Mahasiswa dengan NIM ${nim} telah dihapus`);
                    cetakGaris();
                    this.daftar(next);
                }
            });
            rl.close();
        })
    }

}

class Jurusan {
    constructor() {

    }

    daftar(next) {
        db.serialize(() => {
            let sqlJur = "SELECT * FROM jurusan";
            db.all(sqlJur, (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    var table = new Table({
                        head: ['Id Jurusan', 'Nama Jurusan'],
                        colWidths: [20, 20]
                    });
                    rows.forEach((row) => {
                        table.push([row.id, row.namajurusan]);
                    });
                    console.log(table.toString());
                };
                next()
            })
        });
    }

    cari() {
        rl.question('Masukan ID Jurusan yang anda cari : ', (idJur) => {
            cetakGaris();
            let sqlJur = "SELECT * FROM jurusan WHERE id = ?";
            db.get(sqlJur, [idJur], (err, row) => {
                if (err) {
                    throw err;
                } if (row) {
                    console.log('DETAIL JURUSAN');
                    cetakGaris();
                    console.log(`Id Jurusan     : ${row.id}`);
                    console.log(`Nama Jurusan   : ${row.namajurusan}`);
                } else {
                    console.log(`Jurusan dengan ID ${id}] tidak terdaftar`);
                }
                cetakGaris();
                rl.close();
            });
        });
    }

    tambah(next) {
        console.log('Lengkapi data dibawah ini:');
        rl.question('Id Jurusan :', (id) => {
            rl.question('Nama Jurusan :', (namajurusan) => {
                db.serialize(() => {
                    let sqlJur = `INSERT INTO jurusan (id, namajurusan) VALUES 
                                ("${id}", "${namajurusan}")`;
                    db.run(sqlJur, (err) => {
                        if (err) {
                            throw err;
                        }
                        this.daftar(next)
                    });
                });
            });
        });
        return db;
    }

    hapus(next) {
        rl.question('Masukkan ID Jurusan yang akan dihapus: ', (idJur) => {
            db.run(`DELETE FROM jurusan WHERE id = '${idJur}'`, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Jurusan dengan ID ${idJur} telah dihapus`);
                    cetakGaris();
                    this.daftar(next);
                }
            });
            rl.close();
        })
    }

}

class Dosen {
    constructor() {

    }

    daftar(next) {
        db.serialize(() => {
            let sqlDsn = "SELECT * FROM dosen";
            db.all(sqlDsn, (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    var table = new Table({
                        head: ['Id Dosen', 'Nama Dosen'],
                        colWidths: [15, 20]
                    });
                    rows.forEach((row) => {
                        table.push([row.id, row.nama]);
                    });
                    console.log(table.toString());
                };
                next()
            })
        });
    }

    cari() {
        rl.question('Masukan ID Dosen yang anda cari : ', (idDsn) => {
            cetakGaris();
            let sqlDsn = "SELECT * FROM dosen WHERE id = ?";
            db.get(sqlDsn, [idDsn], (err, row) => {
                if (err) {
                    throw err;
                } if (row) {
                    console.log('DETAIL DOSEN');
                    cetakGaris();
                    console.log(`Id Dosen     : ${row.id}`);
                    console.log(`Nama Dosen   : ${row.nama}`);
                } else {
                    console.log(`Dosen dengan ID ${id}] tidak terdaftar`);
                }
                cetakGaris();
                rl.close();
            });
        });
    }

    tambah(next) {
        console.log('Lengkapi data dibawah ini:');
        rl.question('Id Dosen :', (id) => {
            rl.question('Nama Dosen :', (nama) => {
                db.serialize(() => {
                    let sqlDsn = `INSERT INTO dosen (id, nama) VALUES 
                                ("${id}", "${nama}")`;
                    db.run(sqlDsn, (err) => {
                        if (err) {
                            throw err;
                        }
                        this.daftar(next)
                    });
                });
            });
        });
        return db;
    }

    hapus(next) {
        rl.question('Masukkan ID Dosen yang akan dihapus: ', (idDsn) => {
            db.run(`DELETE FROM dosen WHERE id = '${idDsn}'`, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Dosen dengan ID ${idDsn} telah dihapus`);
                    cetakGaris();
                    this.daftar(next);
                }
            });
            rl.close();
        })
    }

}

class MataKuliah {
    constructor() {

    }

    daftar(next) {
        db.serialize(() => {
            let sqlMk = "SELECT * FROM matakuliah";
            db.all(sqlMk, (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    var table = new Table({
                        head: ['Id Mata Kuliah', 'Nama Mata Kuliah', 'SKS'],
                        colWidths: [25, 40, 8]
                    });
                    rows.forEach((row) => {
                        table.push([row.id, row.nama, row.sks]);
                    });
                    console.log(table.toString());
                };
                next()
            })
        });
    }

    cari() {
        rl.question('Masukan ID Mata Kuliah yang anda cari : ', (idMk) => {
            cetakGaris();
            let sqlMK = "SELECT * FROM matakuliah WHERE id = ?";
            db.get(sqlMk, [idMk], (err, row) => {
                if (err) {
                    throw err;
                } if (row) {
                    console.log('DETAIL MATA KULIAH');
                    cetakGaris();
                    console.log(`Id Mata Kuliah   : ${row.id}`);
                    console.log(`Nama Mata Kuliah : ${row.nama}`);
                    console.log(`Jumlah SKS       : ${row.nama}`);
                } else {
                    console.log(`Mata Kuliah dengan ID ${id}] tidak terdaftar`);
                }
                cetakGaris();
                rl.close();
            });
        });
    }

    tambah(next) {
        console.log('Lengkapi data dibawah ini:');
        rl.question('Id Mata Kuliah :', (id) => {
            rl.question('Nama Mata Kuliah :', (nama) => {
                rl.question('Jumlah SKS :', (sks) => {
                    db.serialize(() => {
                        let sqlMk = `INSERT INTO matakuliah (id, nama, sks) VALUES 
                                ("${id}", "${nama}", "${sks}")`;
                        db.run(sqlMk, (err) => {
                            if (err) {
                                throw err;
                            }
                            this.daftar(next)
                        });
                    });
                });
            });
        });
        return db;
    }

    hapus(next) {
        rl.question('Masukkan ID Mata Kuliah yang akan dihapus: ', (idMk) => {
            db.run(`DELETE FROM dosen WHERE id = '${idMk}'`, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Mata Kuliah dengan ID ${idMk} telah dihapus`);
                    cetakGaris();
                    this.daftar(next);
                }
            });
            rl.close();
        })
    }

}

class Kontrak {
    constructor() {

    }

    daftar(next) {
        db.serialize(() => {
            let sqlKrs = "SELECT * FROM krs";
            db.all(sqlKrs, (err, rows) => {
                if (err) {
                    throw err;
                } else {
                    var table = new Table({
                        head: ['No.', 'Nama Mahasiswa', 'Mata Kuliah', 'Nama Dosen', 'Nilai'],
                        colWidths: [5, 25, 25, 25, 7]
                    });
                    rows.forEach((row) => {
                        table.push([row.no, row.mahasiswa, row.matakuliah, row.dosen, row.nilai]);
                    });
                    console.log(table.toString());
                };
                next()
            })
        });
    }

    cari() {
        rl.question('Masukan No. Kontrak yang anda cari : ', (idKrs) => {
            cetakGaris();
            let sqlKrs = "SELECT * FROM krs WHERE no = ?";
            db.get(sqlKrs, [idKrs], (err, row) => {
                if (err) {
                    throw err;
                } if (row) {
                    console.log('DETAIL KONTRAK STUDI');
                    cetakGaris();
                    console.log(`No. Kontrak    : ${row.no}`);
                    console.log(`Nama Mahasiswa : ${row.mahasiswa}`);
                    console.log(`Mata Kuliah    : ${row.matakuliah}`);
                    console.log(`Nama Dosen     : ${row.dosen}`);
                    console.log(`Nilai          : ${row.nilai}`);
                } else {
                    console.log(`Kontrak dengan Nomor [${id}] tidak terdaftar`);
                }
                cetakGaris();
                rl.close();
            });
        });
    }

    tambah(next) {
        console.log('Lengkapi data dibawah ini:');
        rl.question('Nama Mahasiswa :', (mahasiswa) => {
            rl.question('Mata Kuliah :', (matakuliah) => {
                rl.question('Nama Dosen :', (dosen) => {
                    rl.question('Nilai :', (nilai) => {
                        db.serialize(() => {
                            let sqlKrs = `INSERT INTO krs (mahasiswa, matakuliah, dosen, nilai) VALUES 
                                ("${mahasiswa}", "${matakuliah}", "${dosen}", "${nilai})`;
                            db.run(sqlKrs, (err) => {
                                if (err) {
                                    throw err;
                                }
                                this.daftar(next)
                            });
                        });
                    });
                });
            });
        });
        return db;
    }

    hapus(next) {
        rl.question('Masukkan No. Kontrak yang akan dihapus: ', (idKrs) => {
            db.run(`DELETE FROM krs WHERE no = '${idKrs}'`, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Kontrak dengan Nomor [${idKrs}] telah dihapus`);
                    cetakGaris();
                    this.daftar(next);
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

    //MENU MAHASISWA
    function menuMahasiswa() {
        let mhs = new Mahasiswa();
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
                    mhs.daftar(menuMahasiswa);
                    break;
                case '2':
                    cetakGaris();
                    mhs.cari(menuMahasiswa);
                    break;
                case '3':
                    cetakGaris();
                    mhs.tambah(menuMahasiswa);
                    break;
                case '4':
                    cetakGaris();
                    mhs.hapus(menuMahasiswa);
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


    //MENU JURUSAN
    function menuJurusan() {
        let jur = new Jurusan();
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Jurusan`);
        console.log(`[2]. Cari Jurusan`);
        console.log(`[3]. Tambah Jurusan`);
        console.log(`[4]. Hapus Jurusan`);
        console.log(`[5]. Kembali`);
        cetakGaris();
        rl.question('Masukkan salah satu No. dari opsi diatas: ', (pilJur) => {
            switch (pilJur) {
                case '1':
                    cetakGaris();
                    jur.daftar(menuJurusan);
                    break;
                case '2':
                    cetakGaris();
                    jur.cari(menuJurusan);
                    break;
                case '3':
                    cetakGaris();
                    jur.tambah(menuJurusan);
                    break;
                case '4':
                    cetakGaris();
                    jur.hapus(menuJurusan);
                    break;
                case '5':
                    menuUtama();
                    break;
                default:
                    console.log('Pilihan tidak sesuai, silakan coba kembali!');
                    menuJurusan();
                    break;
            }
        });
    }

    //MENU DOSEN
    function menuDosen() {
        let dsn = new Dosen();
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Dosen`);
        console.log(`[2]. Cari Dosen`);
        console.log(`[3]. Tambah Dosen`);
        console.log(`[4]. Hapus Dosen`);
        console.log(`[5]. Kembali`);
        cetakGaris();
        rl.question('Masukkan salah satu No. dari opsi diatas: ', (pilDsn) => {
            switch (pilDsn) {
                case '1':
                    cetakGaris();
                    dsn.daftar(menuDosen);
                    break;
                case '2':
                    cetakGaris();
                    dsn.cari(menuDosen);
                    break;
                case '3':
                    cetakGaris();
                    dsn.tambah(menuDosen);
                    break;
                case '4':
                    cetakGaris();
                    dsn.hapus(menuDosen);
                    break;
                case '5':
                    menuUtama();
                    break;
                default:
                    console.log('Pilihan tidak sesuai, silakan coba kembali!');
                    menuDosen();
                    break;
            }
        });
    }

    //MENU MATA KULIAH
    function menuMatkul() {
        let mk = new MataKuliah();
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Mata Kuliah`);
        console.log(`[2]. Cari Mata Kuliah`);
        console.log(`[3]. Tambah Mata Kuliah`);
        console.log(`[4]. Hapus Mata Kuliah`);
        console.log(`[5]. Kembali`);
        cetakGaris();
        rl.question('Masukkan salah satu No. dari opsi diatas: ', (pilMk) => {
            switch (pilMk) {
                case '1':
                    cetakGaris();
                    mk.daftar(menuMatkul);
                    break;
                case '2':
                    cetakGaris();
                    mk.cari(menuMatkul);
                    break;
                case '3':
                    cetakGaris();
                    mk.tambah(menuMatkul);
                    break;
                case '4':
                    cetakGaris();
                    mk.hapus(menuMatkul);
                    break;
                case '5':
                    menuUtama();
                    break;
                default:
                    console.log('Pilihan tidak sesuai, silakan coba kembali!');
                    menuMatkul();
                    break;
            }
        });
    }

    //MENU KONTRAK STUDI
    function menuKontrak() {
        let krs = new Kontrak();
        cetakGaris();
        console.log('Silakan pilih opsi dibawah ini')
        console.log(`[1]. Daftar Kontrak`);
        console.log(`[2]. Cari Kontrak`);
        console.log(`[3]. Tambah Kontrak`);
        console.log(`[4]. Hapus Kontrak`);
        console.log(`[5]. Kembali`);
        cetakGaris();
        rl.question('Masukkan salah satu No. dari opsi diatas: ', (pilKrs) => {
            switch (pilKrs) {
                case '1':
                    cetakGaris();
                    krs.daftar(menuKontrak);
                    break;
                case '2':
                    cetakGaris();
                    krs.cari(menuKontrak);
                    break;
                case '3':
                    cetakGaris();
                    krs.tambah(menuKontrak);
                    break;
                case '4':
                    cetakGaris();
                    krs.hapus(menuKontrak);
                    break;
                case '5':
                    menuUtama();
                    break;
                default:
                    console.log('Pilihan tidak sesuai, silakan coba kembali!');
                    menuKontrak();
                    break;
            }
        });
    }


}

function cetakGaris() {
    console.log(`===========================================`);
}

//RUN PROGRAM
login();