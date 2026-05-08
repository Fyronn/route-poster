using System;
using System.Collections.Generic;

namespace RoutePoster.Infrastructure;

public partial class TblKurumDepartmanlar
{
    public int DepartmanId { get; set; }

    public int? KurumId { get; set; }

    public string DepartmanAdi { get; set; } = null!;

    public bool? AktifMi { get; set; }

    public virtual TblMusteriKurumlar? Kurum { get; set; }

    public virtual ICollection<TblKullanicilar> TblKullanicilars { get; set; } = new List<TblKullanicilar>();
}
