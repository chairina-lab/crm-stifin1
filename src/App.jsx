import { useState, useEffect } from "react";

const STIFIN_TYPES = ["Si", "Se", "Ti", "Te", "Ii", "Ie", "Fi", "Fe", "In"];
const STATUS_LIST = ["Leads Masuk", "Dihubungi", "Dijadwalkan", "Tes Selesai", "Hasil Dikirim"];

const STATUS_COLOR = {
  "Leads Masuk":   { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  "Dihubungi":     { bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  "Dijadwalkan":   { bg: "#FEFCE8", text: "#A16207", dot: "#EAB308" },
  "Tes Selesai":   { bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  "Hasil Dikirim": { bg: "#F5F3FF", text: "#6D28D9", dot: "#8B5CF6" },
};

const STATUS_ICON = {
  "Leads Masuk":   "📥",
  "Dihubungi":     "📞",
  "Dijadwalkan":   "📅",
  "Tes Selesai":   "✅",
  "Hasil Dikirim": "📨",
};

const STIFIN_COLOR = {
  Si: "#7C3AED", Se: "#9333EA",
  Ti: "#1D4ED8", Te: "#2563EB",
  Ii: "#0E7490", Ie: "#0891B2",
  Fi: "#BE185D", Fe: "#DB2777",
  In: "#374151",
};

const emptyForm = {
  nama: "", noWa: "", tanggalLahir: "", tipeStifin: "",
  tanggalTes: "", status: "Leads Masuk", catatan: "",
};

// ───── KOMPONEN KECIL ─────

function Badge({ label, color }) {
  return (
    <span style={{
      background: color.bg, color: color.text,
      borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color.dot, display: "inline-block" }} />
      {label}
    </span>
  );
}

function STIFInBadge({ tipe }) {
  if (!tipe) return <span style={{ color: "#9CA3AF", fontSize: 13 }}>—</span>;
  return (
    <span style={{
      background: STIFIN_COLOR[tipe] || "#6B7280",
      color: "#fff", borderRadius: 6, padding: "2px 10px",
      fontSize: 12, fontWeight: 700, letterSpacing: 1,
    }}>{tipe}</span>
  );
}

function RiwayatStatus({ riwayat }) {
  const [buka, setBuka] = useState(false);
  if (!riwayat || riwayat.length === 0) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setBuka(!buka)} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: 12, color: "#6D28D9", fontWeight: 600, padding: 0,
        display: "flex", alignItems: "center", gap: 4,
      }}>
        🕒 Riwayat Status ({riwayat.length}) {buka ? "▲" : "▼"}
      </button>
      {buka && (
        <div style={{ marginTop: 6, borderLeft: "2px solid #EDE9FE", paddingLeft: 12 }}>
          {riwayat.map((r, i) => (
            <div key={i} style={{ marginBottom: 6, position: "relative" }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: STATUS_COLOR[r.status]?.dot || "#9CA3AF",
                position: "absolute", left: -17, top: 4,
              }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: STATUS_COLOR[r.status]?.text || "#374151" }}>
                {STATUS_ICON[r.status]} {r.status}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.waktu}</div>
              {r.catatan && <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>📝 {r.catatan}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UbahStatus({ client, onUbah }) {
  const [buka, setBuka] = useState(false);
  const [catatanUbah, setCatatanUbah] = useState("");
  const [statusBaru, setStatusBaru] = useState("");

  const konfirmasi = (status) => { setStatusBaru(status); setBuka(true); };
  const simpan = () => {
    onUbah(client.id, statusBaru, catatanUbah);
    setBuka(false); setCatatanUbah(""); setStatusBaru("");
  };

  const idxSekarang = STATUS_LIST.indexOf(client.status);
  const statusSelanjutnya = STATUS_LIST[idxSekarang + 1];

  return (
    <>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
        {statusSelanjutnya && (
          <button onClick={() => konfirmasi(statusSelanjutnya)} style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 20,
            border: "1.5px solid #7C3AED", color: "#7C3AED",
            background: "#F5F3FF", cursor: "pointer", fontWeight: 600,
          }}>
            {STATUS_ICON[statusSelanjutnya]} Pindah ke: {statusSelanjutnya}
          </button>
        )}
        {idxSekarang > 0 && (
          <button onClick={() => konfirmasi(STATUS_LIST[idxSekarang - 1])} style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 20,
            border: "1.5px solid #E5E7EB", color: "#6B7280",
            background: "#F9FAFB", cursor: "pointer", fontWeight: 600,
          }}>← Mundur</button>
        )}
      </div>
      {buka && (
        <div style={{ position: "fixed", inset: 0, background: "#00000055", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 340, width: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Ubah Status</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
              <b>{client.nama}</b> → <b style={{ color: STATUS_COLOR[statusBaru]?.text }}>{STATUS_ICON[statusBaru]} {statusBaru}</b>
            </div>
            <textarea placeholder="Catatan perubahan (opsional)..." value={catatanUbah}
              onChange={e => setCatatanUbah(e.target.value)} rows={3}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #E5E7EB", fontSize: 13, resize: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setBuka(false); setCatatanUbah(""); }} style={{ flex: 1, padding: 10, border: "1.5px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: "pointer", fontWeight: 600 }}>Batal</button>
              <button onClick={simpan} style={{ flex: 1, padding: 10, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ───── GRAFIK BATANG STIFIN ─────
function GrafikSTIFIn({ clients }) {
  const data = STIFIN_TYPES.map(t => ({
    tipe: t,
    jumlah: clients.filter(c => c.tipeStifin === t).length,
    warna: STIFIN_COLOR[t],
  }));
  const max = Math.max(...data.map(d => d.jumlah), 1);

  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 14, boxShadow: "0 1px 4px #0001" }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🧬 Distribusi Tipe STIFIn</div>
      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>Jumlah klien per tipe kepribadian genetik</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map(d => (
          <div key={d.tipe} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, fontWeight: 700, fontSize: 12, color: d.warna, textAlign: "right", flexShrink: 0 }}>{d.tipe}</div>
            <div style={{ flex: 1, background: "#F3F4F6", borderRadius: 20, height: 22, overflow: "hidden" }}>
              <div style={{
                width: `${(d.jumlah / max) * 100}%`,
                minWidth: d.jumlah > 0 ? 36 : 0,
                background: d.warna,
                height: "100%", borderRadius: 20,
                transition: "width 0.5s ease",
                display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
              }}>
                {d.jumlah > 0 && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{d.jumlah}</span>}
              </div>
            </div>
            <div style={{ width: 20, fontSize: 12, color: "#9CA3AF", textAlign: "left", flexShrink: 0 }}>
              {d.jumlah === 0 && "0"}
            </div>
          </div>
        ))}
      </div>
      {clients.filter(c => !c.tipeStifin).length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#9CA3AF" }}>
          * {clients.filter(c => !c.tipeStifin).length} klien belum diisi tipe STIFIn-nya
        </div>
      )}
    </div>
  );
}

// ───── REMINDER ULANG TAHUN ─────
function ReminderUltah({ clients, onWA }) {
  const sekarang = new Date();
  const hariIni = sekarang.getDate();
  const bulanIni = sekarang.getMonth();

  const cekUltah = (tglLahir, selisihHari) => {
    if (!tglLahir) return false;
    const tgl = new Date(tglLahir);
    const target = new Date(sekarang);
    target.setDate(sekarang.getDate() + selisihHari);
    return tgl.getDate() === target.getDate() && tgl.getMonth() === target.getMonth();
  };

  const ultahHariIni = clients.filter(c => cekUltah(c.tanggalLahir, 0));
  const ultahMingguIni = clients.filter(c => {
    if (!c.tanggalLahir || cekUltah(c.tanggalLahir, 0)) return false;
    for (let i = 1; i <= 6; i++) {
      if (cekUltah(c.tanggalLahir, i)) return true;
    }
    return false;
  });

  const hariMenuju = (tglLahir) => {
    const tgl = new Date(tglLahir);
    for (let i = 1; i <= 6; i++) {
      if (cekUltah(tglLahir, i)) return i;
    }
    return null;
  };

  const pesanUltah = (nama) =>
    encodeURIComponent(`Halo ${nama}! 🎂\nSelamat Ulang Tahun ya! Semoga panjang umur, sehat selalu, dan semakin berkembang sesuai potensi genetik STIFIn-mu. 🧬✨`);

  return (
    <div style={{ marginBottom: 14 }}>
      {/* BANNER ULTAH HARI INI */}
      {ultahHariIni.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          borderRadius: 14, padding: 16, marginBottom: 12, color: "#fff",
        }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>🎉 Ulang Tahun Hari Ini!</div>
          {ultahHariIni.map(c => (
            <div key={c.id} style={{
              background: "rgba(255,255,255,0.2)", borderRadius: 10,
              padding: "10px 12px", marginBottom: 8,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{c.nama} 🎂</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>📱 {c.noWa}</div>
                <STIFInBadge tipe={c.tipeStifin} />
              </div>
              <a href={`https://wa.me/${c.noWa.replace(/\D/g,"").replace(/^0/,"62")}?text=${pesanUltah(c.nama)}`}
                target="_blank" rel="noreferrer"
                style={{
                  background: "#fff", color: "#16A34A", borderRadius: 8,
                  width: 38, height: 38, fontSize: 18, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none", flexShrink: 0,
                }}>💬</a>
            </div>
          ))}
        </div>
      )}

      {/* ULTAH MINGGU INI */}
      <div style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 1px 4px #0001" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>🎂 Reminder Ulang Tahun</div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14 }}>Klien yang berulang tahun dalam 7 hari ke depan</div>

        {ultahMingguIni.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#9CA3AF" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎈</div>
            <div style={{ fontSize: 13 }}>
              {clients.filter(c => c.tanggalLahir).length === 0
                ? "Belum ada data tanggal lahir klien"
                : "Tidak ada ulang tahun dalam 7 hari ke depan"}
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {ultahMingguIni.map(c => {
              const sisaHari = hariMenuju(c.tanggalLahir);
              const tgl = new Date(c.tanggalLahir);
              return (
                <div key={c.id} style={{
                  border: "1px solid #FDE68A", background: "#FFFBEB",
                  borderRadius: 10, padding: "10px 12px",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{c.nama}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>📱 {c.noWa}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                      <STIFInBadge tipe={c.tipeStifin} />
                      <span style={{
                        background: "#FEF3C7", color: "#92400E",
                        borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700,
                      }}>
                        🗓️ {sisaHari} hari lagi
                      </span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {tgl.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                      </span>
                    </div>
                  </div>
                  <a href={`https://wa.me/${c.noWa.replace(/\D/g,"").replace(/^0/,"62")}?text=${pesanUltah(c.nama)}`}
                    target="_blank" rel="noreferrer"
                    style={{
                      background: "#22C55E", color: "#fff", borderRadius: 8,
                      width: 34, height: 34, fontSize: 15,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      textDecoration: "none", flexShrink: 0,
                    }}>💬</a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ───── LAPORAN HASIL DIKIRIM ─────
function LaporanHasilDikirim({ clients, onWA }) {
  const selesai = clients.filter(c => c.status === "Hasil Dikirim");
  const bulanIni = new Date().getMonth();
  const tahunIni = new Date().getFullYear();

  const selesaiBulanIni = selesai.filter(c => {
    if (!c.riwayat) return false;
    const entri = c.riwayat.find(r => r.status === "Hasil Dikirim");
    if (!entri) return false;
    const tgl = new Date(entri.waktu);
    return tgl.getMonth() === bulanIni && tgl.getFullYear() === tahunIni;
  });

  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 14, boxShadow: "0 1px 4px #0001" }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>📨 Laporan Hasil Dikirim</div>
      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14 }}>Klien yang hasil tes STIFIn-nya sudah dikirimkan</div>

      {/* Ringkasan angka */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#F5F3FF", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#7C3AED" }}>{selesai.length}</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Total hasil dikirim</div>
        </div>
        <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#1D4ED8" }}>{selesaiBulanIni.length}</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Bulan ini</div>
        </div>
      </div>

      {/* Daftar klien selesai */}
      {selesai.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "#9CA3AF" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <div style={{ fontSize: 13 }}>Belum ada klien dengan hasil terkirim</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {selesai.map(c => {
            const entri = c.riwayat?.find(r => r.status === "Hasil Dikirim");
            return (
              <div key={c.id} style={{
                border: "1px solid #EDE9FE", borderRadius: 10, padding: "10px 12px",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{c.nama}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>📱 {c.noWa}</div>
                  {c.tanggalLahir && (
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      🎂 {new Date(c.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                    <STIFInBadge tipe={c.tipeStifin} />
                    {entri && <span style={{ fontSize: 11, color: "#9CA3AF" }}>📨 {entri.waktu}</span>}
                  </div>
                </div>
                <button onClick={() => onWA(c.noWa, c.nama)} style={{
                  background: "#22C55E", color: "#fff", border: "none", borderRadius: 8,
                  width: 34, height: 34, fontSize: 15, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>💬</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ───── MAIN APP ─────
export default function CRMStifin() {
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_stifin_clients_v2");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterStifin, setFilterStifin] = useState("Semua");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState("daftar");

  useEffect(() => {
    localStorage.setItem("crm_stifin_clients_v2", JSON.stringify(clients));
  }, [clients]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.nama.trim() || !form.noWa.trim()) {
      showToast("Nama dan No. WhatsApp wajib diisi.", "error"); return;
    }
    const waktu = new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    if (editId !== null) {
      setClients(clients.map(c => c.id === editId ? { ...c, ...form } : c));
      showToast("Data klien berhasil diperbarui.");
    } else {
      setClients([{ ...form, id: Date.now(), riwayat: [{ status: form.status, waktu, catatan: "Klien ditambahkan" }] }, ...clients]);
      showToast("Klien baru berhasil ditambahkan.");
    }
    setForm(emptyForm); setEditId(null); setShowForm(false);
  };

  const handleUbahStatus = (id, statusBaru, catatan) => {
    const waktu = new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    setClients(clients.map(c => {
      if (c.id !== id) return c;
      return { ...c, status: statusBaru, riwayat: [...(c.riwayat || []), { status: statusBaru, waktu, catatan }] };
    }));
    showToast(`Status diperbarui → ${statusBaru}`);
  };

  const handleEdit = (c) => {
    setForm({ nama: c.nama, noWa: c.noWa, tanggalLahir: c.tanggalLahir || "", tipeStifin: c.tipeStifin, tanggalTes: c.tanggalTes, status: c.status, catatan: c.catatan });
    setEditId(c.id); setShowForm(true); setTab("daftar");
  };

  const handleDelete = (id) => {
    setClients(clients.filter(c => c.id !== id));
    setConfirmDelete(null); showToast("Klien dihapus.", "info");
  };

  const openWA = (noWa, nama) => {
    const clean = noWa.replace(/\D/g, "").replace(/^0/, "62");
    const msg = encodeURIComponent(`Halo ${nama}, saya dari tim STIFIn. Ada yang bisa kami bantu? 😊`);
    window.open(`https://wa.me/${clean}?text=${msg}`, "_blank");
  };

  const filtered = clients.filter(c => {
    const matchSearch = c.nama.toLowerCase().includes(search.toLowerCase()) || c.noWa.includes(search);
    const matchStatus = filterStatus === "Semua" || c.status === filterStatus;
    const matchStifin = filterStifin === "Semua" || c.tipeStifin === filterStifin;
    return matchSearch && matchStatus && matchStifin;
  });

  const stats = {
    total: clients.length,
    leadsmasuk: clients.filter(c => c.status === "Leads Masuk").length,
    dijadwalkan: clients.filter(c => c.status === "Dijadwalkan").length,
    hasilDikirim: clients.filter(c => c.status === "Hasil Dikirim").length,
  };

  const inp = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
    background: "#FAFAFA", boxSizing: "border-box",
  };

  const ultahHariIniCount = clients.filter(c => {
    if (!c.tanggalLahir) return false;
    const tgl = new Date(c.tanggalLahir);
    const skrg = new Date();
    return tgl.getDate() === skrg.getDate() && tgl.getMonth() === skrg.getMonth();
  }).length;

  const TABS = [
    { key: "daftar",    label: "📋 Klien" },
    { key: "pipeline",  label: "🔄 Pipeline" },
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "laporan",   label: "📨 Laporan" },
    { key: "reminder",  label: ultahHariIniCount > 0 ? `🎂 Reminder 🔴` : "🎂 Reminder" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", padding: "20px 20px 0", color: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.75, fontWeight: 600, marginBottom: 4 }}>CRM STIFIN</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Data Klien STIFIn 🧬</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Kelola klien, hasil tes, & follow-up dalam satu tempat</div>
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: "8px 14px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer",
                fontWeight: 700, fontSize: 12, whiteSpace: "nowrap",
                background: tab === t.key ? "#fff" : "transparent",
                color: tab === t.key ? "#4F46E5" : "rgba(255,255,255,0.8)",
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* STATS - tampil di semua tab */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, margin: "16px 0" }}>
          {[
            { label: "Total Klien", val: stats.total, color: "#4F46E5" },
            { label: "Leads Masuk", val: stats.leadsmasuk, color: "#3B82F6" },
            { label: "Dijadwalkan", val: stats.dijadwalkan, color: "#EAB308" },
            { label: "Hasil Dikirim", val: stats.hasilDikirim, color: "#8B5CF6" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 8px", textAlign: "center", boxShadow: "0 1px 4px #0001" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ===== TAB DAFTAR KLIEN ===== */}
        {tab === "daftar" && (
          <>
            <div style={{ background: "#fff", borderRadius: 12, padding: 14, marginBottom: 12, boxShadow: "0 1px 4px #0001" }}>
              <input placeholder="🔍  Cari nama atau nomor WA..." value={search}
                onChange={e => setSearch(e.target.value)} style={{ ...inp, marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inp, width: "auto", flex: 1 }}>
                  <option value="Semua">Semua Status</option>
                  {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={filterStifin} onChange={e => setFilterStifin(e.target.value)} style={{ ...inp, width: "auto", flex: 1 }}>
                  <option value="Semua">Semua Tipe STIFIn</option>
                  {STIFIN_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {showForm && (
              <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 14, boxShadow: "0 2px 12px #4F46E520", border: "1.5px solid #EDE9FE" }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, color: "#4F46E5" }}>
                  {editId ? "✏️ Edit Data Klien" : "➕ Tambah Klien Baru"}
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <input name="nama" placeholder="Nama lengkap *" value={form.nama} onChange={handleChange} style={inp} />
                  <input name="noWa" placeholder="No. WhatsApp (contoh: 08123456789) *" value={form.noWa} onChange={handleChange} style={inp} inputMode="numeric" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 4 }}>Tanggal Lahir</label>
                      <input name="tanggalLahir" type="date" value={form.tanggalLahir} onChange={handleChange} style={inp} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, display: "block", marginBottom: 4 }}>Tanggal Tes</label>
                      <input name="tanggalTes" type="date" value={form.tanggalTes} onChange={handleChange} style={inp} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <select name="tipeStifin" value={form.tipeStifin} onChange={handleChange} style={inp}>
                      <option value="">Tipe STIFIn</option>
                      {STIFIN_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <select name="status" value={form.status} onChange={handleChange} style={inp}>
                      {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <textarea name="catatan" placeholder="Catatan tambahan..." value={form.catatan} onChange={handleChange}
                    rows={3} style={{ ...inp, resize: "vertical" }} />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleSubmit} style={{
                      flex: 1, padding: "10px 0", background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                      color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer",
                    }}>{editId ? "Simpan Perubahan" : "Simpan Klien"}</button>
                    <button onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }} style={{
                      padding: "10px 16px", background: "#F3F4F6", color: "#374151",
                      border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
                    }}>Batal</button>
                  </div>
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#9CA3AF" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🧬</div>
                <div style={{ fontWeight: 600 }}>{clients.length === 0 ? "Belum ada klien. Tambahkan yang pertama!" : "Tidak ada klien yang sesuai filter."}</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {filtered.map(c => (
                  <div key={c.id} style={{ background: "#fff", borderRadius: 12, padding: 14, boxShadow: "0 1px 4px #0001", border: "1px solid #F3F4F6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>{c.nama}</div>
                        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>📱 {c.noWa}</div>
                        {c.tanggalLahir && (
                          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
                            🎂 {new Date(c.tanggalLahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          <STIFInBadge tipe={c.tipeStifin} />
                          <Badge label={c.status} color={STATUS_COLOR[c.status] || STATUS_COLOR["Leads Masuk"]} />
                          {c.tanggalTes && (
                            <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                              📅 {new Date(c.tanggalTes).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                        {c.catatan && (
                          <div style={{ marginTop: 8, fontSize: 13, color: "#6B7280", background: "#F9FAFB", borderRadius: 6, padding: "6px 10px" }}>
                            📝 {c.catatan}
                          </div>
                        )}
                        <UbahStatus client={c} onUbah={handleUbahStatus} />
                        <RiwayatStatus riwayat={c.riwayat} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button onClick={() => openWA(c.noWa, c.nama)} title="Buka WhatsApp" style={{ background: "#22C55E", color: "#fff", border: "none", borderRadius: 8, width: 36, height: 36, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</button>
                        <button onClick={() => handleEdit(c)} title="Edit" style={{ background: "#EEF2FF", color: "#4F46E5", border: "none", borderRadius: 8, width: 36, height: 36, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✏️</button>
                        <button onClick={() => setConfirmDelete(c.id)} title="Hapus" style={{ background: "#FEF2F2", color: "#EF4444", border: "none", borderRadius: 8, width: 36, height: 36, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===== TAB PIPELINE ===== */}
        {tab === "pipeline" && (
          <div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>Ringkasan klien berdasarkan tahap. Ubah status dari tab Klien.</div>
            {STATUS_LIST.map((status) => {
              const klienDiStatus = clients.filter(c => c.status === status);
              const color = STATUS_COLOR[status];
              return (
                <div key={status} style={{ marginBottom: 12 }}>
                  <div style={{ background: color.bg, borderRadius: "10px 10px 0 0", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${color.dot}` }}>
                    <div style={{ fontWeight: 700, color: color.text, fontSize: 14 }}>{STATUS_ICON[status]} {status}</div>
                    <span style={{ background: color.dot, color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{klienDiStatus.length}</span>
                  </div>
                  {klienDiStatus.length === 0 ? (
                    <div style={{ background: "#fff", borderRadius: "0 0 10px 10px", padding: "12px 14px", fontSize: 13, color: "#9CA3AF" }}>Tidak ada klien di tahap ini</div>
                  ) : (
                    <div style={{ background: "#fff", borderRadius: "0 0 10px 10px" }}>
                      {klienDiStatus.map((c, i) => (
                        <div key={c.id} style={{ padding: "10px 14px", borderBottom: i < klienDiStatus.length - 1 ? "1px solid #F3F4F6" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nama}</div>
                            <div style={{ fontSize: 12, color: "#9CA3AF" }}>📱 {c.noWa}</div>
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <STIFInBadge tipe={c.tipeStifin} />
                            <button onClick={() => openWA(c.noWa, c.nama)} style={{ background: "#22C55E", color: "#fff", border: "none", borderRadius: 8, width: 30, height: 30, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== TAB DASHBOARD ===== */}
        {tab === "dashboard" && (
          <div>
            <GrafikSTIFIn clients={clients} />

            {/* Ringkasan tipe terbanyak */}
            {clients.filter(c => c.tipeStifin).length > 0 && (() => {
              const terbanyak = STIFIN_TYPES.map(t => ({ tipe: t, jumlah: clients.filter(c => c.tipeStifin === t).length }))
                .sort((a, b) => b.jumlah - a.jumlah)[0];
              return (
                <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 14, boxShadow: "0 1px 4px #0001" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>🏆 Insight Cepat</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ background: "#F5F3FF", borderRadius: 10, padding: "12px 16px", flex: 1, minWidth: 140 }}>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginBottom: 4 }}>TIPE TERBANYAK</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <STIFInBadge tipe={terbanyak.tipe} />
                        <span style={{ fontSize: 20, fontWeight: 800, color: STIFIN_COLOR[terbanyak.tipe] }}>{terbanyak.jumlah} klien</span>
                      </div>
                    </div>
                    <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "12px 16px", flex: 1, minWidth: 140 }}>
                      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, marginBottom: 4 }}>SUDAH DIISI TIPE</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#15803D" }}>
                        {clients.filter(c => c.tipeStifin).length} / {clients.length}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ===== TAB LAPORAN ===== */}
        {tab === "laporan" && (
          <LaporanHasilDikirim clients={clients} onWA={openWA} />
        )}

        {/* ===== TAB REMINDER ===== */}
        {tab === "reminder" && (
          <ReminderUltah clients={clients} onWA={openWA} />
        )}

      </div>

      {/* TOMBOL TAMBAH */}
      {!showForm && tab === "daftar" && (
        <button onClick={() => { setShowForm(true); setForm(emptyForm); setEditId(null); }} style={{
          position: "fixed", bottom: 24, right: 20, zIndex: 100,
          background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
          color: "#fff", border: "none", borderRadius: 50, width: 56, height: 56,
          fontSize: 26, cursor: "pointer", boxShadow: "0 4px 16px #4F46E540",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>+</button>
      )}

      {/* KONFIRMASI HAPUS */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "#00000055", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 320, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🗑️</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Hapus klien ini?</div>
            <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>Data yang dihapus tidak bisa dikembalikan.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: 10, border: "1.5px solid #E5E7EB", borderRadius: 8, background: "#fff", cursor: "pointer", fontWeight: 600 }}>Batal</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: 10, background: "#EF4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? "#EF4444" : toast.type === "info" ? "#6B7280" : "#22C55E",
          color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 16px #0002", zIndex: 300, whiteSpace: "nowrap",
        }}>{toast.msg}</div>
      )}
    </div>
  );
}
