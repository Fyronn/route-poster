using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblRotalar
{
    public int RotaId { get; set; }

    public int? KurumId { get; set; }

    public string RotaAdi { get; set; } = null!;

    public string? Yon { get; set; }

    public string? VardiyaTipi { get; set; }

    public TimeOnly PlanlananBaslangicSaati { get; set; }

    public int? TahminiSureDakika { get; set; }

    public string? CalismaGunleri { get; set; }

    public string? Statu { get; set; }

    public DateTime? OlusturmaTarihi { get; set; }

    public bool? AktifMi { get; set; }

    public virtual TblMusteriKurumlar? Kurum { get; set; }

    public virtual ICollection<TblRotaDuraklari> TblRotaDuraklaris { get; set; } = new List<TblRotaDuraklari>();

    public virtual ICollection<TblSeferler> TblSeferlers { get; set; } = new List<TblSeferler>();

    public virtual ICollection<TblYolcuIstisnalari> TblYolcuIstisnalaris { get; set; } = new List<TblYolcuIstisnalari>();

    public virtual ICollection<TblYolcuRotaTercihleri> TblYolcuRotaTercihleris { get; set; } = new List<TblYolcuRotaTercihleri>();
}
