using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblSeferYoklama
{
    public int YoklamaId { get; set; }

    public int? SeferId { get; set; }

    public int? YolcuId { get; set; }

    public int? DurakId { get; set; }

    public string? KatilimDurumu { get; set; }

    public DateTime? IslemZamani { get; set; }

    public int? IslemiYapanId { get; set; }

    public virtual TblDuraklar? Durak { get; set; }

    public virtual TblKullanicilar? IslemiYapan { get; set; }

    public virtual TblSeferler? Sefer { get; set; }

    public virtual TblKullanicilar? Yolcu { get; set; }
}
