using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblDuraklar
{
    public int DurakId { get; set; }

    public int? TurizmFirmaId { get; set; }

    public int? KurumId { get; set; }

    public string DurakAdi { get; set; } = null!;

    public decimal? Enlem { get; set; }

    public decimal? Boylam { get; set; }

    public string? Adres { get; set; }

    public string? Statu { get; set; }

    public int? BirlestirilenDurakId { get; set; }

    public string? OperatorNotu { get; set; }

    public bool? AktifMi { get; set; }

    public virtual TblDuraklar? BirlestirilenDurak { get; set; }

    public virtual ICollection<TblDuraklar> InverseBirlestirilenDurak { get; set; } = new List<TblDuraklar>();

    public virtual TblMusteriKurumlar? Kurum { get; set; }

    public virtual ICollection<TblRotaDuraklari> TblRotaDuraklaris { get; set; } = new List<TblRotaDuraklari>();

    public virtual ICollection<TblSeferYoklama> TblSeferYoklamas { get; set; } = new List<TblSeferYoklama>();

    public virtual ICollection<TblYolcuRotaTercihleri> TblYolcuRotaTercihleriBinisDuraks { get; set; } = new List<TblYolcuRotaTercihleri>();

    public virtual ICollection<TblYolcuRotaTercihleri> TblYolcuRotaTercihleriInisDuraks { get; set; } = new List<TblYolcuRotaTercihleri>();

    public virtual TblTurizmFirmalari? TurizmFirma { get; set; }
}
